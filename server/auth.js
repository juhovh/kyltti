var db = require('./db');

exports.setup = function(app) {

  app.post('/api/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    db.authenticate(username, password, function(success) {
      if (success) {
        if (req.session) {
          req.session.username = username;
        }
        res.send(204);
      } else {
        res.send(403);
      }
    });
  });

  app.get('/api/logout', function(req, res) {
    if (req.session) {
      req.session.reset();
    }
  });

};
