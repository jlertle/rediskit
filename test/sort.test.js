'use strict';

/**
 * Module dependencies.
 */

var should = require('should');
var assert = require('assert');
var List = require('../').List;
var Hash = require('../').Hash;

describe('Sort Test', function(){

  it('sort.alpha.desc test', function(done) {
    var list = new List('letters');
    list.destroy();
    list.rpush('a');
    list.rpush('c');
    list.rpush('d');
    list.rpush('b');
    list.sort.alpha.desc.limit(1, 3).end(function(err, res){
      res.should.eql(['c', 'b', 'a']);
      done();
    });

  });

  it('sort.limit(count) test', function(done) {
    var list = new List('nums');
    list.destroy();
    list.rpush(1);
    list.rpush(2);
    list.rpush(3);
    list.rpush(4);
    list.sort.desc.limit(2).end(function(err, res){
      res.should.eql(['4', '3']);
      done();
    });

  });

  it('sort.by(pattern) test', function(done) {
    var list = new List('pets')
      , client = list.client;
    list.destroy();
    list.rpush('tobi');
    list.rpush('jane');
    list.rpush('loki');
    list.rpush('bandit');
    list.rpush('ewald');
    client.set('tobi:age', 1);
    client.set('loki:age', .5);
    client.set('jane:age', 3);
    client.set('ewald:age', 4);
    client.set('bandit:age', 6);
    list.sort.by('*:age').end(function(err, res){
      res.should.eql(['loki', 'tobi', 'jane', 'ewald', 'bandit']);
      done();
    });

  });

  it('sort.get(pattern) test', function(done) {
    var list = new List('pets')
      , client = list.client
      , tobi = new Hash('pet:tobi')
      , loki = new Hash('pet:loki')
      , jane = new Hash('pet:jane');

    list.destroy();
    list.rpush('tobi');
    list.rpush('jane');
    list.rpush('loki');

    tobi.set('age', 1);
    loki.set('age', 0.5);
    jane.set('age', 3);

    list.sort.by('pet:*->age').get('#').get('pet:*->age').end(function(err, res){
      res.should.eql(['loki', '0.5', 'tobi', '1', 'jane', '3']);
      done();
    });

  });

});