var mongodb = require('./db');

function Course(){}

module.exports = Course;

Course.prototype.all = function(callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('courses', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.find().sort({time: -1}).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

Course.prototype.save = function(newCourse, callback) {

  if (newCourse.name === '' || newCourse.author === '' || newCourse.overview === ''|| newCourse.coverImagePath === '') {
    return callback('Error: Has empty fields!');
  }

  var course = {
    name: newCourse.name,
    author: newCourse.author,
    overview: newCourse.overview,
    created_at: new Date(),
    coverImagePath: newCourse.coverImagePath
  };

  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('courses', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.insert(course, {safe: true}, function (err, course) {
        mongodb.close();
        return callback(null);
      });
    });
  });
};

Course.get = function (name, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('course', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      var query = {};
      if (name) {
        query.name = name;
      }

      collection.find(query).sort({time: -1}).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          callback(err);
        }
        callback(null, docs);
      });
    });
  });
};