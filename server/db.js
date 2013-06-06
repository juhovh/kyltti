var sqlite3 = require('sqlite3');
var db = new sqlite3.cached.Database('database.sqlite', sqlite3.READWRITE);

exports.listGossips = function(callback) {
  var query = "SELECT * FROM gossip";
  db.all(query, callback);
};

exports.findGossipById = function(id, callback) {
  var query = "SELECT * FROM gossip WHERE id = ?";
  var params = [''+id];
  db.get(query, params, callback);
};

exports.listDestinations = function(callback) {
  var query = "SELECT * FROM destination";
  db.all(query, callback);
};

exports.findDestinationById = function(id, callback) {
  var query = "SELECT * FROM destination WHERE id = ?";
  var params = [''+id];
  db.get(query, params, callback);
};

exports.listPhotos = function(callback) {
  var query = "SELECT photo.id, destination.name AS destination, photo.caption, photo.fn " +
              "FROM photo, destination " +
              "WHERE photo.deleted = 0 AND photo.destination_id = destination.id";
  db.all(query, callback);
};

exports.findPhotoById = function(id, callback) {
  var query = "SELECT photo.id, destination.name AS destination, photo.caption, photo.fn " +
              "FROM photo, destination " +
              "WHERE photo.id = ? AND photo.deleted = 0 AND photo.destination_id = destination.id";
  var params = [''+id];
  db.get(query, params, callback);
};

exports.findPhotosByGroup = function(group, callback) {
  var query = "SELECT photo.id, destination.name AS destination, photo.caption, photo.fn " +
              "FROM photo, destination " +
              "WHERE photo.deleted = 0 AND photo.destination_id = destination.id AND destination.name = ?";
  var params = [''+group];
  db.all(query, params, callback);
};
