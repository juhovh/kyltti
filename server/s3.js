var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/../awsConfig.json');

var s3 = new AWS.S3();
module.exports = s3;
