var chai = require('chai');
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should();
var db = require('../server/db');

describe('Test db operations', function(){
    describe('db.listGossips()', function(){
        it('should return more than 0 gossips', function(done){
            db.listGossips(function(err, rows) {
                assert.isNull(err, 'there was no error');
                assert.isArray(rows, 'gossip list is an array');
                assert.operator(rows.length, '>', 0, 'gossip list has more than zero gossips');
                var gossip = rows[0];
                assert.isObject(gossip, 'gossip is an object');
                assert.property(gossip, 'id');
                done();
            });
        });
    });
     
    describe('db.findGossipById(id)', function(){
        it('should return exactly one gossip', function(done){
            db.findGossipById(1, function(err, gossip) {
                assert.isNull(err, 'there was no error');
                assert.isObject(gossip, 'gossip is an object');
                assert.property(gossip, 'id');
                done();
            });
        });
    });
    
    describe('db.listPhotos()', function(){
        it('should return more than 0 photos', function(done){
            db.listPhotos(function(err, rows) {
                assert.isNull(err, 'there was no error');
                assert.isArray(rows, 'photo list is an array');
                var photo = rows[0];
                assert.isObject(photo, 'photo is an object');
                assert.property(photo, 'id');
                done();
            });
        });
    });
    
    describe('db.findPhotoById(id)', function(){
        it('should return exactly one photo', function(done){
            db.findGossipById(1, function(err, photo) {
                assert.isNull(err, 'there was no error');
                assert.isObject(photo, 'photo is an object');
                assert.property(photo, 'id');
                done();
            });
        });
    });
});
