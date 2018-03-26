const fs = require('fs-extra');
const path = require('path');
const rabbitmq = require('../utils/rabbitmq');
const queue = require('../utils/queue');
const ffmpeg = require('fluent-ffmpeg');

const queueName = 'ShrinkFile';

SHRINKFOLDER='content/shrinkfolder';
fs.ensureDirSync(SHRINKFOLDER);


rabbitmq({ queue: queueName }, function(conn, ch) {
  ch.consume(queueName, function(msg) {
    var { origin, id } = JSON.parse(msg.content.toString());
    var shrinkfile = path.format({
      dir: SHRINKFOLDER,
      name: 'shrink_' + path.basename(origin)
    })

    ffmpeg(origin)
      .outputOptions('-strict -2')
      .on('error', function(err) {
        throw err;
      })
      .on('end', () => {
        console.log('Shrinked file:', shrinkfile)
        fs.unlinkSync(origin)
        queue('DashFile', JSON.stringify({
          origin: shrinkfile,
          id: id
        }))
        ch.ack(msg);
      })
      .save(shrinkfile)
  });
});
