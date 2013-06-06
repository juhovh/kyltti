var _ = require('underscore');

var db = require('./db');

exports.setup = function(app) {

  app.get('/', function(req, res) {
    db.listGroups(function(err, rows) {
      if (err) {
        res.send(500);
        return;
      }

      var sortedgroups = _.sortBy(rows, function(group) { return group.name; });
      var groups = _.map(sortedgroups, function(group) {
        return {
          url: '/groups/'+group.id,
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

  app.get('/groups/:id', function(req, res) {
    db.listGroups(function(err, groups) {
      db.findPhotosByGroupId(req.params.id, function(err, photos) {
        if (err) {
          res.send(500);
          return;
        }

        var sortedgroups = _.sortBy(groups, function(group) { return group.name; });
        var groupmodels = _.map(sortedgroups, function(group) {
          return {
            url: '/groups/'+group.id,
            name: group.name
          };
        });
        var imagemodels = _.map(photos, function(photo) {
          return {
            url: '/api/photos/'+photo.id+'/medium',
            description: photo.description
          };
        });
        res.render('menu', {groups: groupmodels}, function(err, menu) {
          res.render('imagelist', {images: imagemodels}, function(err, imagelist) {
            res.render('main', {
              menu: menu,
              content: imagelist
            });
          });
        });
      });
    });
  });
};
