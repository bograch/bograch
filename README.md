# bograch

Bograch is a tool for abstracting RPC (remote procedure call) communication between/with NodeJS microservices.

[![Dependency Status](https://david-dm.org/bograch/bograch.svg)](https://david-dm.org/bograch/bograch)
[![Build Status](https://travis-ci.org/bograch/bograch.svg?branch=master)](https://travis-ci.org/bograch/bograch)
[![npm version](https://badge.fury.io/js/bograch.svg)](http://badge.fury.io/js/bograch)


## Usage

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

Math.factorial(10, function (err, result) {
  console.log(result);
});
```


## License

The MIT License (MIT)
