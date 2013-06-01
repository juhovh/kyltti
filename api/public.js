var db = require('./db');
var s3 = require('./s3');

var bucket = 'kyltti';

exports.setup = function(app) {
  app.get('/api/gossips/', function(req, res) {
    var query = "SELECT * FROM gossip";
    db.all(query, function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else {
        res.send(rows);
      }
    });
  });
  
  app.get('/api/gossips/:id', function(req, res) {
    var query = "SELECT * FROM gossip WHERE id = ?";
    var params = [req.params.id];
    db.get(query, params, function(err, row) {
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
    var query = "SELECT * FROM destination";
    db.all(query, function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else {
        res.send(rows);
      }
    });
  });
  
  app.get('/api/destinations/:id', function(req, res) {
    var query = "SELECT * FROM destination WHERE id = ?";
    var params = [req.params.id];
    db.get(query, params, function(err, row) {
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
    var query = "SELECT photo.id, destination.name AS destination, photo.caption, photo.deleted " +
                "FROM photo, destination " +
                "WHERE photo.destination_id = destination.id AND photo.deleted = 0"; 
    var params = [];
    if (req.query.destination) {
      query += " AND destination.name = ?";
      params.push(req.query.destination);
    }
    db.all(query, params, function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else {
        res.send(rows);
      }
    });
  });

  app.get('/api/photos/:id', function(req, res) {
    var query = "SELECT photo.id, destination.name AS destination, photo.caption, photo.deleted " +
                "FROM photo, destination " +
                "WHERE photo.id = ? AND photo.destination_id = destination.id AND photo.deleted = 0"; 
    var params = [req.params.id];
    db.get(query, params, function(err, row) {
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
    var query = "SELECT photo.fn FROM photo WHERE photo.id = ?";
    var params = [req.params.id];

    db.get(query, params, function(err, row) {
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
