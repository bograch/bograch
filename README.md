# Bograch [![Dependency Status](https://david-dm.org/zkochan/bograch/status.svg?style=flat)](https://david-dm.org/zkochan/bograch) [![Build Status](http://img.shields.io/travis/zkochan/bograch.svg?style=flat)](https://travis-ci.org/zkochan/bograch)
Bograch is a tool for abstracting RPC (remote procedure call) communication between/with NodeJS microservices.

Usage
======
Add a transporter.
``` js
var bo = require('bograch');
var AmqpTransporter = require('bograch-amqp');

bo.use(new AmqpTransporter({
  amqpURL: 'amqp://guest:guest@localhost:5672'
}));
```
Create a microservice for mathematical calculations and implement some remote methods.
``` js
var server = bo.server('amqp', {
  name: 'mathOperations'
});

server.on('sum', function (a, b, cb) {
  cb(null, a + b);
});

server.on('factorial', function (n, cb) {
  var f = 1;
  for (var i = 2; i <= n; i++) {
    f *= i;
  }
  cb(null, f);
});
```
Create a client for the math microservice and call some of its remote methods.
``` js
var client = bo.client('amqp', {
  name: 'mathOperations'
});
client.register(['sum', 'factorial']);

var Math = client.methods;

Math.sum(12, 2, function (err, sum) {
  console.log(sum);
});

Math.sum(10, function (err, sum) {
  console.log(sum);
});
```

License
========

The MIT License (MIT)
