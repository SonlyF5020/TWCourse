/**
 * Module dependencies.
 */
var express = require('express');
var Course = require('./models/course.js');
var formidable = require('formidable');
var http = require('http');
var fs = require('fs');
var path = require('path');
var settings = require('./settings');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser({uploadDir:'./uploads'}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// basic routes
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/api', function (req, res) {
  res.render('api');
});

app.get('/success', function (req, res) {
  res.render('success');
});

app.get('/error', function (req, res) {
  res.render('error');
});

// courses routes
app.get('/courses/index', function (req, res) {
  new Course().all(function(error, docs) {
    res.render('courses/index', {courses: docs});
  });
});

app.get('/courses', function (req, res) {
  new Course().all(function(error, docs) {
    res.json(docs);
  });
});

app.get('/courses/new', function (req, res) {
  res.render('courses/new');
});

app.post('/courses/new', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    fs.readFile(files.coverImage.path, function (err, data) {
      var imagePath = '/images/' + files.coverImage.name;
      fs.writeFile(imagePath, data, function (err) {
        var course = new Course();
        course.save({name: fields.name, author: fields.author, overview: fields.overview, coverImagePath: imagePath}, function (err) {
          if (err !== null) {
            return res.render('error', {errorMessage: err});
          }
          res.render('success');
        });
      });
    });
  });
});