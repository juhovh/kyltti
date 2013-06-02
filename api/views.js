var _ = require('underscore');

var db = require('./db');

exports.setup = function(app) {
  app.get('/', function(req, res) {
    var query = "SELECT photo.id, photo.destination_id, destination.name AS destination " +
                "FROM photo, destination " +
                "WHERE photo.destination_id = destination.id AND photo.deleted = 0";
    db.all(query, function(err, rows) {
      if (err) {
        res.send(500);
        return;
      }
      var destinations = _.uniq(_.pluck(rows, 'destination')).sort();
      var frontphotos = _.uniq(rows, false, function(row) { return row.destination_id; });
      var sortedphotos = _.sortBy(frontphotos, function(photo) { return photo.destination; });
      var thumbnails = _.map(sortedphotos, function(row) {
        return {
          url: '/api/photos/'+row.id+'/thumb',
          destination: row.destination
        };
      });
      res.render('imagegrid', {thumbnails: thumbnails}, function(err, html) {
        res.render('main', {
          destinations: destinations,
          content: html.replace(new RegExp('\r?\n', 'g'), '')
        });
      });
    });
  });
};
