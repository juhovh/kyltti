var chai = require('chai');
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should();
var db = require('../server/db');

describe('Test db operations', function(){
    describe('db.listNews()', function(){
        it('should return more than 0 gossips', function(done){
            db.listNews(function(err, rows) {
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
     
    describe('db.findNewsById(id)', function(){
        it('should return exactly one gossip', function(done){
            db.findNewsById(1, function(err, gossip) {
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
                assert.operator(rows.length, '>', 0, 'photo list has more than zero photos');
                var photo = rows[0];
                assert.isObject(photo, 'photo is an object');
                assert.property(photo, 'id');
                done();
            });
        });
    });
    
    describe('db.findPhotoById(id)', function(){
        it('should return exactly one photo', function(done){
            db.findPhotoById(1, function(err, photo) {
                assert.isNull(err, 'there was no error');
                assert.isObject(photo, 'photo is an object');
                assert.property(photo, 'id');
                done();
            });
        });
    });

    describe('db.listGroups()', function(){
        it('should return more than 0 destinations', function(done){
            db.listGroups(function(err, rows) {
                assert.isNull(err, 'there was no error');
                assert.isArray(rows, 'destination list is an array');
                assert.operator(rows.length, '>', 0, 'destination list has destinations');
                var destination = rows[0];
                assert.isObject(destination, 'destination is an object');
                assert.property(destination, 'id');
                done();
            });
        });
    });
    
    describe('db.findGroupById(id)', function(){
        it('should return exactly one destination', function(done){
            db.findGroupById(1, function(err, destination) {
                assert.isNull(err, 'there was no error');
                assert.isObject(destination, 'destination is an object');
                assert.property(destination, 'id');
                done();
            });
        });
    });
        
    describe('db.findPhotosByGroupId(group_id)', function(){
        it('should return multiple photos', function(done){
            db.findPhotosByGroupId(1, function(err, destinations) {
                assert.isNull(err, 'there was no error');
                assert.isArray(destinations, 'destination is an object');
                assert.operator(destinations.length, '>', 0, 'photo group has photos');
                var destination = destinations[0];
                assert.property(destination, 'id');
                done();
            });
        });
    });
});
