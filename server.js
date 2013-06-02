var express = require('express');
var cons = require('consolidate');
var clientSessions = require('client-sessions');

var views = require('./api/views');
var public = require('./api/public');
var private = require('./api/private');


var app = express();

app.configure(function() {
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(clientSessions({
    secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK'
  }));
  app.use(express.static(__dirname + '/public'));

  // Set rendering engine for HTML
  app.engine('html', cons.underscore);

  // Default engine HTML, set template path
  app.set('view engine', 'html');
  app.set('views', __dirname + '/public/views');
});

views.setup(app);
public.setup(app);
private.setup(app);

app.listen(3000);
