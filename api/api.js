const formidable = require('formidable');
const GoPro = require('../models/gopro');

module.exports = {
  search,
  vtt,
  upload
}

function search(req, res) {
  console.log(req.body)
  GoPro.find({
    'geo.coordinates': {
      $geoIntersects: {
        $geometry: req.body.geometry
      }
    }
  })
  .select('time')
  .exec(function(err, gopros) {
    if(err) {
      res.status(500).send(err)
    } else if(!gopros.length) {
      res.sendStatus(404)
    } else {
      for(var i=0; i < gopros.length; i++) {
        gopros[i] = gopros[i].toObject();
        gopros[i].time.splice(1, gopros[i].time.length - 2);
      }
      res.send(gopros)
    }
  })
}

function vtt(req, res) {
  var videoId = req.query.id;
  GoPro
  .findOne({_id: videoId})
  .exec(function(err, gopro) {
    if(err) {
      return res.sendStatus(404);
    }
    gopro = gopro.toObject()
    var vtt = 'WEBVTT - Telemery File\n';
    var start = gopro.time[0];
    gopro.geo.coordinates.forEach(function(v, i) {
      // vtt += '\n' + i;
      vtt += '\n';
      vtt += formatTime(gopro.time[i] - start) + ' --> ' + formatTime(gopro.time[i+1] - start) + '\n';
      vtt += v.join() + '\n';
    })
    res.set('Content-Type', 'text/vtt');
    res.status(200);
    res.send(vtt);
  })
}

function upload(req, res) {
  console.log(req.url)
  var form = new formidable.IncomingForm();
  form.uploadDir = 'content/dropfolder';
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    if(err) {
      console.log(err);
      res.send(err)
    } else {
      res.status(200).send()
    }
  })
}

function formatTime(time) {
  var h = Math.floor(time / 3600000)
  if(h < 10) h = '0' + h;
  var ms = new Date(time).toISOString().slice(13,-1)
  return `${h}${ms}`;
}
