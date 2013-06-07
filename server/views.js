var _ = require('underscore');

var db = require('./db');

function getSortedGroups(selected, callback) {
  if (typeof(selected) === 'function') {
    callback = selected;
    selected = null;
  }
  db.listGroups(function(err, rows) {
    if (err) {
      callback(err, null);
      return;
    }
    var sortedgroups = _.sortBy(rows, function(group) { return group.name; });
    var groups = _.map(sortedgroups, function(group) {
      var random_idx = Math.floor((Math.random()*group.photo_ids.length));
      return {
        name: group.name,
        url: '/groups/'+group.id,
        imageurl: '/api/photos/'+group.photo_ids[random_idx]+'/thumb',
        selected: (selected === ''+group.id)
      };
    });
    callback(null, groups);
  });
}

exports.setup = function(app) {

  app.get('/', function(req, res) {
    getSortedGroups(function(err, groups) {
      if (err) {
        res.send(500);
        return;
      }

      res.render('menu', {groups: groups}, function(err, menu) {
        if (err) {
          res.send(500);
          return;
        }
        res.render('imagegrid', {groups: groups}, function(err, imagegrid) {
          if (err) {
            res.send(500);
            return;
          }
          res.render('main', {
            menu: menu,
            content: imagegrid
          });
        });
      });
    });
  });

  app.get('/groups/:id', function(req, res) {
    getSortedGroups(req.params.id, function(err, groups) {
      if (err) {
        res.send(500);
        return;
      }
      db.findPhotosByGroupId(req.params.id, function(err, photos) {
        if (err) {
          res.send(500);
          return;
        }

        var imagemodels = _.map(photos, function(photo) {
          return {
            url: '/api/photos/'+photo.id+'/medium',
            description: photo.description
          };
        });
        res.render('menu', {groups: groups}, function(err, menu) {
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
