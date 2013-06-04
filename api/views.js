var _ = require('underscore');

var db = require('./db');

exports.setup = function(app) {
  app.get('/', function(req, res) {
    db.listPhotos(function (err, rows) {
      if (err) {
        res.send(500);
        return;
      }
      var destinations = _.uniq(_.pluck(rows, 'destination')).sort();
      var sortedphotos = _.sortBy(rows, function(photo) { return photo.destination; });
      var frontphotos = _.uniq(sortedphotos, true, function(photo) { return photo.destination; });
      var thumbnails = _.map(frontphotos, function(row) {
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
