'use strict';

var BograchWorker = require('../lib/bograch-worker');
var expect = require('chai').expect;

var noop = function () {};
var provider = {
  on: noop
};
var boWorker = new BograchWorker(provider);

describe('Bograch worker on', function () {
  it('should throw an error if no parameters were passed', function () {
    expect(function () {
      boWorker.on();
    }).to.throw(TypeError, 'Bograch.on requires a message');
  });
  
  it('should throw an error if no callback function is passed', function () {
    expect(function () {
      boWorker.on('foo');
    }).to.throw(TypeError, 'Bograch.on requires a callback function');
  });
  
  it('should throw an error if invalid callback function is passed', function () {
    expect(function () {
      boWorker.on('foo', 234);
    }).to.throw(TypeError, 'Bograch.on requires a callback function');
  });
  
  it('should not throw an exception if the second parameter is a callback function', function () {
    expect(function () {
      boWorker.on('foo', noop);
    }).not.to.throw(Error);
  });
});