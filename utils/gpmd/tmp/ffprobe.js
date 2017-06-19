var fs = require('fs')
var Stream = require('stream');
var gpmd = require('../lib/raw');
var gpmd2vtt = require('../lib/vtt');
var ffmpeg = require('fluent-ffmpeg');


ffmpeg.ffprobe('../test/sample.mp4', function(err, data) {
  var duration = data.streams[3].duration_ts;
  var gpStream = data.streams.find((v) => v.codec_tag_string == 'gpmd')
  var duration = gpStream.duration_ts;
  console.log(duration)

  // ffmpeg('./test.mp4')
  //   .outputOptions(['-codec copy', '-map 0:3', '-f rawvideo'])
  //   .on('start', function(cmd) {
  //     console.log(cmd)
  //   })
  //   .on('error', console.error)
  //   .pipe(gpmd({mode: 'raw'}))
  //   .pipe(gpmd2vtt())
  //   .pipe(fs.createWriteStream('/dev/stdout'))
})

