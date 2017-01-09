var express = require('express');
var app = express();
var serverVars_dev = require('./environment/devVars.json');
var serverVars_prod = require('./environment/prodVars.json');
app.use(express.static('build'));
var http = require('http');
var htmlPath = "/build/html/";

app.get('/', function (req, res) {
   res.sendFile( __dirname + htmlPath + "index.html");
})

app.get('/code1', function(req, res) {
	res.sendFile(__dirname + htmlPath + "nodejs/transforms/npm-init.html");
})

app.get('/nodejs', function(req, res) {
	res.sendFile(__dirname + htmlPath + "nodejs.html");
})

app.get('/swift', function(req, res) {
	res.sendFile(__dirname + htmlPath + "swift.html");
})

app.get('/aws', function(req, res) {
	res.sendFile(__dirname + htmlPath + "aws.html");
})

app.get('/csharp', function(req, res) {
	res.sendFile(__dirname + htmlPath + "csharp.html");
})

app.get('/nodejs/:name', function(req, res) {
	res.sendFile(__dirname + htmlPath + "nodejs/transforms/" + req.params.name + ".html");
})

app.get('/swift/:name', function(req, res) {
	res.sendFile(__dirname + htmlPath + "swift/transforms/" + req.params.name + ".html");
})

app.get('/aws/:name', function(req, res) {
	res.sendFile(__dirname + htmlPath + "aws/transforms/" + req.params.name + ".html");
})

app.get('/csharp/:name', function(req, res) {
	res.sendFile(__dirname + htmlPath + "csharp/transforms/" + req.params.name + ".html");
})

var server = app.listen(8085, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Site is running at http://%s:%s", host, port)

})