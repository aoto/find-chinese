// 把find_chinese.js拷贝到浏览器src目录下，命令行执行：node find_chinese.js wow/chrome/browser ['.html', '.js', '.css']

var fs = require('fs'),
  readline = require('readline'),
  path = require('path');

var fileSuffix = process.argv[3] || ['.html', '.js', '.css', '.cc', '.h'];

fs.writeFile('chinese.txt', '', function(err) {
  if (err) throw err;
});

var walk = function(dir, done) {
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

walk(process.argv[2] || 'wow', function(err, results) {
  if (err) throw err;
  console.log('查找路径：', process.argv[2] || 'wow');  
  console.log('共找到' + results.length + '个文件 in', fileSuffix);

  for (var i = 0; i < results.length; i++) {
    readFile(results[i]);
  };
});

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