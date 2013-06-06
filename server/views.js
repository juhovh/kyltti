var _ = require('underscore');

var db = require('./db');

exports.setup = function(app) {
  app.get('/', function(req, res) {
    db.listPhotos(function (err, rows) {
      if (err) {
        res.send(500);
        return;
      }
      var sortedphotos = _.sortBy(rows, function(photo) { return photo.destination; });
      var groupedphotos = _.uniq(sortedphotos, true, function(photo) { return photo.destination; });

      var groups = _.map(groupedphotos, function(group) {
        return {
          url: '/group/'+group.destination,
          name: group.destination
        };
      });
      var thumbnails = _.map(groupedphotos, function(group) {
        return {
          url: '/api/photos/'+group.id+'/thumb',
          caption: group.destination
        };
      });
      res.render('menu', {groups: groups}, function(err, menu) {
        res.render('imagegrid', {thumbnails: thumbnails}, function(err, imagegrid) {
          res.render('main', {
            menu: menu,
            content: imagegrid
          });
        });
      });
    });
  });
};
