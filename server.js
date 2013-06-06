var app = require('./server/app');

var secret = '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK';
var viewspath = __dirname + '/public/views';
var staticpath = __dirname + '/public';

var server = app(secret, viewspath, staticpath);
var port = process.env.PORT || 3000;
server.listen(port);
