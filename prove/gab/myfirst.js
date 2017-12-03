// http://localhost:8080/info.html?first=gab&second=lab

var http = require('http'); // createServer
var mymod = require('./mymodule.js'); // example module with date+time
var url = require('url'); // parsing
var fs = require('fs'); // file system
var events = require('events'); // handle events
var eventEmitter = new events.EventEmitter();
eventEmitter.on('file_action',function(){console.log('file action!')});

http.createServer(function (req, res) {
  var q = url.parse(req.url,true);
  var qq = q.query;
  var filename = '.' + q.pathname;
  // !!the res.[..] writing must be all in readFile!! 
  // if readFile is not necessary, the content works alone
  fs.readFile(filename,function(err,data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.write('Date and time: ' + mymod.myDateTime() + '<br>');
    res.write('request was: ' + req.url + '<br>');
    res.write('host: ' + q.host + '<br>');
    res.write('pathname: ' + q.pathname + '<br>');
    res.write('search: ' + q.search + '<br>');
    res.write('parsing gives: ' + qq.first + ' ' + qq.second);
    res.end();
  });
  // append
  fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
    eventEmitter.emit('file_action');
  });
  // rename
  fs.rename('mynewfile1.txt','myoldfile1.txt',function(err){
    if(err) throw err;
    console.log('rename file');
    eventEmitter.emit('file_action');
  });
  // ? incomplete: as it is, it doesn't write anything
  fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved!');
    eventEmitter.emit('file_action');
  }); 
  // DELETE file
  fs.unlink('mynewfile2.txt',function(err){
    if(err) throw err;
    console.log('File deleted');
    eventEmitter.emit('file_action');
  });
  // overwrite
  fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
    eventEmitter.emit('file_action');
  }); 
}).listen(8080); 
