const express = require('express');
var app = express();

console.log(__dirname + '/../dist');
app.use(express.static(__dirname + '/../dist'));

var server = app.listen(process.env.PORT || 3000);
