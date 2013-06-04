var db = require('./db');
var s3 = require('./s3');

var bucket = 'kyltti';

exports.setup = function(app) {
  app.get('/api/gossips/', function(req, res) {
    db.listGossips(function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else {
        res.send(rows);
      }
    });
  });
  
  app.get('/api/gossips/:id', function(req, res) {
    db.findGossipById(req.params.id, function(err, row) {
      if (err) {
        res.send(500, {error: err});
      } else if (!row) {
        res.send(404, {error: "Gossip not found"});
      } else {
        res.send(row);
      }
    });
  });
  
  app.get('/api/destinations/', function(req, res) {
    db.listDestinations(function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else {
        res.send(rows);
      }
    });
  });
  
  app.get('/api/destinations/:id', function(req, res) {
    db.findDestinationById(req.params.id, function(err, row) {
      if (err) {
        res.send(500, {error: err});
      } else if (!row) {
        res.send(404, {error: "Destination not found"});
      } else {
        res.send(row);
      }
    });
  });
  
  app.get('/api/photos/', function(req, res) {
    var callback = function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else {
        res.send(rows);
      }
    };
    if (req.query.group) {
      db.findPhotosByGroup(req.query.group, callback);
    } else {
      db.listPhotos(callback);
    }
  });

  app.get('/api/photos/:id', function(req, res) {
    db.findPhotoById(req.params.id, function(err, row) {
      if (err) {
        res.send(500, {error: err});
      } else if (!row) {
        res.send(404, {error: "Photo not found"});
      } else {
        res.send(row);
      }
    });
  });

  app.get('/api/photos/:id/:size', function(req, res) {
    db.findPhotoById(req.params.id, function(err, row) {
      if (err) {
        res.send(500);
      } else if (!row) {
        res.send(404, {error: "Image not found"});
      } else {
        var filename;
        switch (req.params.size) {
          case 'thumb':
            filename = 'photos/square/' + row.fn;
            break;
          case 'medium':
            filename = 'photos/medium/' + row.fn;
            break;
          default:
            res.send(404, {error: "Image size is invalid"});
            return;
        }
        var params = {Bucket: bucket, Key: filename};
        s3.getObject(params, function(err, data) {
          if (err) {
            res.send(err.statusCode, err.message);
          } else {
            res.writeHead(200, {'Content-Type': data.ContentType});
            res.end(data.Body);
          }
        });
      }
    });
  });

};
