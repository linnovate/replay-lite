const ffmpeg = require('fluent-ffmpeg');

ffmpeg('../../mpeg-dash/assets/Ness_Ziona.MP4')
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
  .on('end', () => {
    console.log('Dashed to folder:', dashfolder)
    fs.unlinkSync(msg.origin)
    queue('DashFile', JSON.stringify({
      origin: shrinkfile,
      dest: msg.dest
    }))
  })
  .save('test/manifest.mpd')
