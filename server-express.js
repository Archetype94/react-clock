console.log('Initializing...');

var outputFolder = 'build';

var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.join(__dirname, outputFolder)));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render('index');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, req.url));
});

app.listen(8081, function() {
  console.log('Server has successfully started');
});



