var express = require('express');
var cons = require('consolidate');
var clientSessions = require('client-sessions');

var views = require('./views');
var public = require('./public');
var private = require('./private');

module.exports = function(secret, viewspath, staticpath) {
  if (!secret || !viewspath || !staticpath) {
    throw new Error("App parameter missing!");
  }

  var app = express();
  app.configure(function() {
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(clientSessions({
      secret: secret
    }));
    app.use(express.static(staticpath));

    // Set rendering engine for HTML
    app.engine('html', cons.underscore);

    // Default engine HTML, set template path
    app.set('view engine', 'html');
    app.set('views', viewspath);
  });

  views.setup(app);
  public.setup(app);
  private.setup(app);

  return app;
};
