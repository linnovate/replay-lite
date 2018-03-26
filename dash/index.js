const fs = require('fs-extra');
const path = require('path');
const rabbitmq = require('../utils/rabbitmq');
const queue = require('../utils/queue');
const ffmpeg = require('fluent-ffmpeg');

const queueName = 'DashFile';

VIDEOFOLDER='content/video';
fs.ensureDirSync(VIDEOFOLDER);


rabbitmq({ queue: queueName }, function(conn, ch) {
  ch.consume(queueName, function(msg) {
    var { origin, id } = JSON.parse(msg.content.toString());
    var dashfolder = path.format({
      dir: path.join(VIDEOFOLDER, id)
    })
    var manifest = path.format({
      dir: dashfolder,
      name: 'manifest.mpd'
    })

    fs.ensureDirSync(dashfolder);

    ffmpeg(origin)
      .outputOptions('-strict -2')
      .outputOptions('-vf yadif=0')
      .outputOptions('-r 25')
      .outputOptions('-vcodec libx264')
      .outputOptions('-keyint_min 0')
      .outputOptions('-g 100')
      .outputOptions('-b:v 1000k')
      .outputOptions('-ac 2')
      .outputOptions('-strict -2')
      .outputOptions('-acodec aac')
      .outputOptions('-ab 64k')
      .outputOptions('-map 0:v')
      .outputOptions('-map 0:a')
      .outputOptions('-f dash')
      .outputOptions('-min_seg_duration 1000000')
      .outputOptions('-use_template 1')
      .outputOptions('-use_timeline 1')
      .outputOptions('-init_seg_name init-\$RepresentationID\$.mp4')
      .outputOptions('-media_seg_name test-\$RepresentationID\$-\$Number\$.mp4')
      .on('error', function(err) {
        throw err;
      })
      .on('end', () => {
        console.log('Dashed to folder:', dashfolder)
        fs.unlinkSync(origin)
        ch.ack(msg);
      })
      .save(manifest)
  });
});
