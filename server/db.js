var sqlite3 = require('sqlite3');
var passwordHash = require('password-hash');
var _ = require('underscore');

var db = new sqlite3.cached.Database('database.sqlite', sqlite3.READWRITE);


exports.authenticate = function(username, password, callback) {
  var query = 'SELECT * FROM "user" WHERE "username" = ?';
  var params = [username];
  db.get(query, params, function(err, user) {
    if (err || !user) {
      callback(false);
    } else if (passwordHash.verify(password, user.password)) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.listNews = function(callback) {
  var query = 'SELECT * FROM "news" WHERE deleted = 0 ORDER BY date DESC';
  db.all(query, callback);
};

exports.findNewsById = function(id, callback) {
  var query = 'SELECT * FROM "news" WHERE id = ?';
  var params = [''+id];
  db.get(query, params, callback);
};

exports.listGroups = function(callback) {
  var query = 'SELECT "group".*, GROUP_CONCAT("photo".id) AS photo_ids ' +
              'FROM "group", "photo" ' +
              'WHERE "group".id = "photo".group_id GROUP BY("photo".group_id)';
  db.all(query, function(err, rows) {
    if (rows) {
      _.each(rows, function(row) {
        if (row.photo_ids) {
          row.photo_ids = _.map(row.photo_ids.split(','), function(id) { return parseInt(id, 10); });
        }
      });
    }
    callback(err, rows);
  });
};

exports.findGroupById = function(id, callback) {
  // NOTE: Using listGroups might be inefficient, but it is easier
  exports.listGroups(function(err, rows) {
    var row = _.find(rows, function(row) { return row.id == id; });
    callback(err, row);
  });
};

exports.listPhotos = function(callback) {
  var query = 'SELECT * FROM "photo" WHERE deleted = 0';
  db.all(query, callback);
};

exports.findPhotoById = function(id, callback) {
  var query = 'SELECT * FROM "photo" WHERE deleted = 0 AND id = ?';
  var params = [''+id];
  db.get(query, params, callback);
};

exports.findPhotosByGroupId = function(group_id, callback) {
  var query = 'SELECT * FROM photo WHERE deleted = 0 AND group_id = ?';
  var params = [''+group_id];
  db.all(query, params, callback);
};
