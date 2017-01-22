var express = require('express');
var app = express();
var serverVars_dev = require('./environment/devVars.json');
var serverVars_prod = require('./environment/prodVars.json');
app.use(express.static('build'));
var http = require('http');
var path = require('path');
var htmlPath = "/build/html/";
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, htmlPath));

app.get('/', function (req, res) {
   //res.sendFile( __dirname + htmlPath + "index.html");
   res.render('index');
})

/*app.get('/code1', function(req, res) {
	res.sendFile(__dirname + htmlPath + "nodejs/transforms/npm-init.html");
})*/

app.get('/nodejs', function(req, res) {
	//res.sendFile(__dirname + htmlPath + "nodejs.html");
	res.render('nodejs');
})

app.get('/swift', function(req, res) {
	//res.sendFile(__dirname + htmlPath + "swift.html");
	res.render('swift');
})

app.get('/aws', function(req, res) {
	//res.sendFile(__dirname + htmlPath + "aws.html");
	res.render('aws');
})

app.get('/csharp', function(req, res) {
	//res.sendFile(__dirname + htmlPath + "csharp.html");
	res.render('csharp');
})

app.get('/nodejs/:name', function(req, res) {
	res.render("nodejs/transforms/" + req.params.name);
})

app.get('/swift/:name', function(req, res) {
	res.render("swift/transforms/" + req.params.name);
})

app.get('/aws/:name', function(req, res) {
	//res.render(__dirname + htmlPath + "aws/transforms/" + req.params.name + ".html");
	res.render("aws/transforms/" + req.params.name);
	//res.sendFile(__dirname + htmlPath + "aws/transforms/" + req.params.name + ".html");
})

app.get('/csharp/:name', function(req, res) {
	res.render("csharp/transforms/" + req.params.name);
})

var server = app.listen(8085, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Site is running at http://%s:%s", host, port)

})