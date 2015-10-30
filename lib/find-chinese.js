'use strict';

var fs = require('fs'),
  readline = require('readline'),
  path = require('path');

function walk(dir, fileSuffix, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (fileSuffix.indexOf(path.extname(file)) !== -1) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

function readFile(filePath) {
  var rd = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false
  });

  var count = 1;
  rd.on('line', function(line) {
    line = line.trim();
    if (isChineseChar(line)) {
      line = filePath + '   ' + 'Line:' + count + '   ' + line + '\n';
      fs.appendFileSync('chinese.txt', line);
    }
    count++;
  });
}

function isChineseChar(str) {
  var reg = /[\u4E00-\u9FA5\uF900-\uFA2D\uFF00-\uFFEF]/;
  return reg.test(str);
}

exports.walk = walk;
exports.readFile = readFile;