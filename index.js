var express = require('express');
var https = require('https');
var path = require('path');
var app = express();
var fs = require('fs');
app.use(express.static('build'));
app.set('view engine', 'ejs');
var serverVars;

switch (process.env.NODE_ENV) {
	case 'dev' :
		serverVars = require('./environment/devVars.json');
	case 'prod' :
		serverVars = require('./environment/prodVars.json');
}

// vars loaded from env files. Should be env dependent.
var htmlPath = serverVars.htmlPath;

var options = {
	key  : fs.readFileSync('server.enc.key'),
	cert : fs.readFileSync('server.crt'),
	passphrase : serverVars.cert_passphrase
};

app.set('views', path.join(__dirname, htmlPath));


app.get('/', function (req, res) {
   res.render('index');
})

app.get('/nodejs', function(req, res) {
	res.render('nodejs');
})

app.get('/swift', function(req, res) {
	res.render('swift');
})

app.get('/aws', function(req, res) {
	res.render('aws');
})

app.get('/csharp', function(req, res) {
	res.render('csharp');
})

app.get('/nodejs/:name', function(req, res) {
	res.render("nodejs/transforms/" + req.params.name);
})

app.get('/swift/:name', function(req, res) {
	res.render("swift/transforms/" + req.params.name);
})

app.get('/aws/:name', function(req, res) {
	res.render("aws/transforms/" + req.params.name);
})

app.get('/csharp/:name', function(req, res) {
	res.render("csharp/transforms/" + req.params.name);
})

var server = https.createServer(options, app).listen(process.env.PORT, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Site is running at http://%s:%s", host, port)

})