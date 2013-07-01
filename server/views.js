var _ = require('underscore');

var db = require('./db');

function getSortedGroups(callback) {
  db.listGroups(function(err, rows) {
    if (err) {
      callback(err, null);
      return;
    }
    var sortedgroups = _.sortBy(rows, function(group) { return group.name; });
    var groups = _.map(sortedgroups, function(group) {
      var random_idx = Math.floor((Math.random()*group.photo_ids.length));
      return {
        id: group.id,
        name: group.name,
        url: '/groups/'+group.id,
        imageurl: '/api/photos/'+group.photo_ids[random_idx]+'/thumb'
      };
    });
    callback(null, groups);
  });
}

function getNews(callback) {
  db.listNews(function(err, rows) {
    if (err) {
      callback(err, null);
      return;
    }
    var news = _.map(rows, function(news_item) {
      var news_date = new Date(news_item.date);
      news_date = news_date.getDate() + '.' + (news_date.getMonth() + 1) + '.' + news_date.getFullYear();
      return {
        title: news_item.title,
        message: news_item.message,
        date: news_date
      };
    });
    callback(null, news);
  });
}

exports.setup = function(app) {

  app.get('/', function(req, res) {

    getSortedGroups(function(err, groups) {
      if (err) {
        res.send(500);
        return;
      }

      getNews(function(err, news) {
        if (err) {
          res.send(500);
          return;
        }

        res.render('menu', {groups: groups, selected_group: null}, function(err, menu) {
          if (err) {
            res.send(500);
            return;
          }
          res.render('imagegrid', {groups: groups}, function(err, imagegrid) {
            if (err) {
              res.send(500);
              return;
            }
            res.render('news', {news: news}, function(err, newsitems) {
              if (err) {
                res.send(500);
                return;
              }
              res.render('main', {
                menu: menu,
                content: imagegrid,
                news: newsitems
              });
            });
          });
        });
      });
    });
  });

  app.get('/groups/:id', function(req, res) {
    getSortedGroups(function(err, groups) {
      if (err) {
        res.send(500);
        return;
      }
      db.findPhotosByGroupId(req.params.id, function(err, photos) {
        if (err) {
          res.send(500);
          return;
        }

        var images = _.map(photos, function(photo) {
          return {
            url: '/api/photos/'+photo.id+'/medium',
            description: photo.description
          };
        });

        var i, navigation = {};
        for (i=0; i<groups.length; i++) {
          if (req.params.id === ''+groups[i].id) {
            navigation.previous = groups[i-1];
            navigation.current = groups[i];
            navigation.next = groups[i+1];
            break;
          }
        }

        res.render('menu', {groups: groups, selected_group: req.params.id}, function(err, menu) {
          if (err) {
            res.send(500);
            return;
          }
          res.render('imagelist', {images: images, navigation: navigation}, function(err, imagelist) {
            if (err) {
              res.send(500);
              return;
            }
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
