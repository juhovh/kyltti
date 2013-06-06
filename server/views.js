var _ = require('underscore');

var db = require('./db');

exports.setup = function(app) {
  app.get('/', function(req, res) {
    db.listGroups(function (err, rows) {
      if (err) {
        res.send(500);
        return;
      }

      var sortedgroups = _.sortBy(rows, function(group) { return group.name; });
      var groups = _.map(sortedgroups, function(group) {
        return {
          url: '/group/'+group.id,
          name: group.name
        };
      });
      var thumbnails = _.map(sortedgroups, function(group) {
        var random_idx = Math.floor((Math.random()*group.photo_ids.length));
        return {
          url: '/api/photos/'+group.photo_ids[random_idx]+'/thumb',
          caption: group.name
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
