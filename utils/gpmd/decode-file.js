const ffmpeg = require('fluent-ffmpeg');
const decodeStream = require('./decode-stream');

module.exports = function(path, config, callback) {

  if(typeof config == 'function') {
    callback = config;
    config = {};
  }

  // default options
  config = Object.assign({
    readableObjectMode: false
  }, config)

  ffmpeg.ffprobe(path, function(err, data) {
    if(err) throw err;

    var gpStream = data.streams.find((v) => v.codec_tag_string == 'gpmd');
    if(!gpStream) throw new Error('GoPro MetaData stream not found in ' + path)

    var stream = ffmpeg(path)
      .outputOptions(['-codec copy', '-map 0:' + gpStream.index, '-f rawvideo'])
      .on('error', function(err) {
        throw err;
      })
      .pipe(decodeStream(config));

    stream.duration = gpStream.duration_ts;

    callback(stream)
  })

}
