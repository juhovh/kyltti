var db = require('./db');

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
    var params = [req.params.id]
    db.all(query, params, function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else if (rows.length !== 1) {
        res.send(404, {error: "Gossip not found"});
      } else {
        res.send(rows[0]);
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
    db.all(query, params, function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else if (rows.length !== 1) {
        res.send(404, {error: "Destination not found"});
      } else {
        res.send(rows[0]);
      }
    });
  });
  
  app.get('/api/photos/', function(req, res) {
    var query = "SELECT photo.id, destination.name AS destination, photo.caption, photo.fn, photo.deleted " +
                "FROM photo, destination " +
                "WHERE photo.destination_id = destination.id"; 
    var params = []
    if (req.query.destination != null) {
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
    var query = "SELECT photo.id, destination.name AS destination, photo.caption, photo.fn, photo.deleted " +
                "FROM photo, destination " +
                "WHERE photo.id = ? AND photo.destination_id = destination.id"; 
    var params = [req.params.id];
    db.all(query, params, function(err, rows) {
      if (err) {
        res.send(500, {error: err});
      } else if (rows.length !== 1) {
        res.send(404, {error: "Photo not found"});
      } else {
        res.send(rows[0]);
      }
    });
  });
};
