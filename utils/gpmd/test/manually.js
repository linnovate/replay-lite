const gpmd = require('..');
const fs = require('fs');
const Stream = require('stream');
const path = require('path');
const video = path.resolve(__dirname, 'sample.mp4');

// var outfile = '/dev/null';
var outfile = '/dev/stdout';
outfile = fs.createWriteStream(outfile)

gpmd.decodeFile(video, {
  readableObjectMode: true
}, (stream) => {
  var geovtt = vtt({
    index: true,
    duration: stream.duration,
    headerComment: 'Hello World !!!'
  });
  stream.pipe(geovtt).pipe(outfile)
})

function leadZero(v, n) {
  return ('0'.repeat(n) + v).slice(-n);
}

function formatTime(time) {
  return new Date(time).toISOString().slice(11,-1)
}

function formatCoords(coords) {
  return (coords / 10000000)
}


function writeVtt(v) {
  var vtt = '\n';
  if(this.vttindex) {
    vtt += this.vttindex++ + '\n';
  }
  vtt += formatTime(this.vtttime) + ' --> ' + formatTime(this.vtttime + this.vttrange) + '\n';
  vtt += formatCoords(v[0]) + ',' + formatCoords(v[1]) + '\n';
  this.vtttime += this.vttrange;
  this.push(vtt)
}


function vtt(options) {

  options = Object.assign({
    index: false,
    duration: undefined,
    headerComment: 'Telemery file'
  }, options)

  if(!options.duration) {
    console.warn('No video duration specified')
  }


  var stream = new Stream.Transform({
    writableObjectMode: true,
    transform(data, encoding, done) {
      if(data.key == 'GPSU') {
        var nextTime = gpmd.utils.gpsu2date(data.value[0]);
        if(this.gps && this.prevTime) {
          this.vttrange = (nextTime - this.prevTime) / this.gps.length;
          this.gps.forEach(writeVtt, this)
        }
        this.prevTime = nextTime
      } else if(data.key == 'GPS5') {
        this.gps = data.value;
      }
      done()
    },
    flush(done) {
      if(options.duration > this.vtttime) {
        this.vttrange = (options.duration - this.vtttime) / this.gps.length;
        this.gps.forEach(writeVtt, this)
      } else if(options.duration < this.vtttime) {
        console.warn('Wrong duration ' + options.duration + ' smaller than ' + this.vtttime)
      }
      done()
    }
  })

  stream.on('pipe', function() {
    const header = 'WEBVTT - ' + options.headerComment + '\n';
    stream.push(header)
    if(options.index) {
      this.vttindex = 1;
    }
    this.vtttime = 0;
  })

  return stream;
}
