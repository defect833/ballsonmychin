var express = require('express');
var ejs = require('ejs');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var fs = require('fs');
var logger = require("./utils/logger");

// Setup the app using Express
var app = express();

// Setup the web server host and port
const host = process.env.INTERNAL_HOST || 'http://localhost';
const port = process.env.INTERNAL_PORT || 3000;

// Setup the image path
const files = fs.readdirSync(process.env.IMG_PATH) || './public/img/about/';

// Setup the random quotes of awesomeness
var quotes = process.env.KC_QUOTES.split('","') || 'No quotes found!';
var quote_count = quotes.length;

var imgCount = files.length;

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
//app.use(morgan('combined')); 					// log every request to the console
app.use(morgan('combined', {stream: logger.stream})); // Log to console and file
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

// serve an empty page that just loads the browserify bundle
app.get('/', function(req, res) {
  var pagename = "Home";

  res.render('pages/index', {
    pagename: pagename
  });
});

app.get('/about', function(req, res) {
  var pagename = "About";
  var min = 1;
  var max = imgCount;
  var min_quotes = 1;
  var max_quotes = quote_count;

  var imgFile = Math.round(Math.random() * (max - min) + min);
  var curQuote = quotes[(Math.round(Math.random() * (max_quotes - min_quotes) + min_quotes)-1)];

  res.render('pages/about', {
    pagename: pagename,
    imgFile: imgFile,
    curQuote: curQuote
  });
});

app.listen(port);

console.log('Listening on port '+port+'. Open up '+host+':'+port+'/ in your browser.');
