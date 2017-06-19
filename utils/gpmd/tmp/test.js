var fs = require('fs')
var Stream = require('stream');
var gpmd = require('..');
var ffmpeg = require('fluent-ffmpeg');

ffmpeg('test/sample.mp4')
  .outputOptions(['-codec copy', '-map 0:3', '-f rawvideo'])
  .on('start', function(cmd) {
    console.log(cmd)
  })
  .on('error', function (err) {
    console.log('*************', err)
  })
  .on('end', function(err, stdout) {
    console.log(stdout)
  })
  // .save('./test.bin')
  .pipe(gpmd.decodeStream())
  .pipe(fs.createWriteStream('/dev/stdout'))
