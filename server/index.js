var express = require('express');
var clientSessions = require('client-sessions');

var public = require('./public');
var private = require('./private');


var app = express();

app.configure(function() {
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(clientSessions({
    secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK'
  }));
  app.use(express.static(__dirname + '/../public'));
});

public.setup(app);
private.setup(app);

app.listen(3000);
