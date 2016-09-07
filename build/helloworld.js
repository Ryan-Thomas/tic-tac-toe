'use strict';

var port = process.argv[2];

var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.end('Hello World!');
});
app.listen(port);