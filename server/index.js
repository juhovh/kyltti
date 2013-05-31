var express = require('express');
var sqlite3 = require('sqlite3');
var _ = require('underscore');

var db = new sqlite3.Database('database.sqlite', sqlite3.READWRITE);

var app = express();
app.configure(function() {
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/../public'));
});

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
  db.all(query, req.params.id, function(err, rows) {
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
  var query = "SELECT * FROM destination ORDER BY name ASC";
  db.all(query, function(err, rows) {
    if (err) {
      res.send(500, {error: err});
    } else {
      res.send(_.pluck(rows, 'name'));
    }
  });
});

app.get('/api/photos/', function(req, res) {
  var query = "SELECT photo.* destination.name AS destination" +
              "FROM photo, destination " +
              "WHERE photo.destination_id = destination.id"; 
  db.all(query, function(err, rows) {
    if (err) {
      res.send(500, {error: err});
    } else {
      res.send(rows);
    }
  });
});
app.get('/api/photos/:id', function(req, res) {
  var query = "SELECT photo.*, destination.name AS destination " +
              "FROM photo, destination " +
              "WHERE photo.id = ? AND photo.destination_id = destination.id"; 
  db.all(query, req.params.id, function(err, rows) {
    if (err) {
      res.send(500, {error: err});
    } else if (rows.length !== 1) {
      res.send(404, {error: "Photo not found"});
    } else {
      res.send(rows[0]);
    }
  });
});

app.listen(3000);
