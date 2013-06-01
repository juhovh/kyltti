var _ = require('underscore');

var db = require('./db');

exports.setup = function(app) {
  app.get('/', function(req, res) {
    var query = "SELECT photo.id AS id, destination.name AS destination " +
                "FROM photo, destination " +
                "WHERE photo.destination_id = destination.id AND photo.deleted = 0";
    db.all(query, function(err, rows) {
      var destinations = _.uniq(_.pluck(rows, 'destination'));
      var frontphotos = _.uniq(rows, true, function(row) { return row.id; });
      var thumbnails = _.map(rows, function(row) {
        return {
          url: '/api/photos/'+row.id+'/thumb',
          destination: row.destination
        };
      });
      res.render('imagegrid', {thumbnails: thumbnails}, function(err, html) {
        res.render('index', {
          destinations: destinations,
          content: html.replace(new RegExp('\r?\n', 'g'), '')
        });
      });
    })
  });
};
