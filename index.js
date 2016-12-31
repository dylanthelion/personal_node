var express = require('express');
var app = express();
var serverVars_dev = require('./environment/devVars.json');
var serverVars_prod = require('./environment/prodVars.json');
app.use(express.static('public'));
var http = require('http');
var htmlPath = "/public/html/";

app.get('/', function (req, res) {
   res.sendFile( __dirname + htmlPath + "index.html");
})

var server = app.listen(8085, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Site is running at http://%s:%s", host, port)

})