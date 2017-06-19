const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const gpmd = require('..');

describe('#decodeStream', () => {
  const bin = path.resolve(__dirname, 'sample.bin');
  it('Should return a transform stream', (done) => {
    const stream = gpmd.decodeStream();
    expect(stream).to.be.an.instanceof(require('stream').Transform);
    done();
  })
  it('Should output raw data', (done) => {
    const stream = gpmd.decodeStream({readableObjectMode: true});
    var keys = [
      'ACCL',
      // 'DEVC',
      'DVID',
      'DVNM',
      // 'EMPT',
      'GPS5',
      'GPSF',
      'GPSP',
      'GPSU',
      'GYRO',
      'SCAL',
      'SIUN',
      // 'STRM',
      'TMPC',
      'TSMP',
      'UNIT'
    ];
    stream.on('data', function(data) {
      const index = keys.indexOf(data.key)
      if(index+1) {
        keys.splice(index, 1)
      }
    });
    stream.on('end', () => {
      expect(keys).to.be.empty;
      done();
    })
    fs.createReadStream(bin).pipe(stream);
  })
})

describe('#decodeFile', () => {
  const video = path.resolve(__dirname, 'sample.mp4');
/*  it('Should return node-fluent-ffmpeg instance', (done) => {
    gpmd.decodeFile(video, function(stream) {
      expect(stream).to.be.an.instanceof(require('fluent-ffmpeg'));
      done();
    });
  })*/
  it('Should return a transform stream', (done) => {
    gpmd.decodeFile(video, function(stream) {
      expect(stream).to.be.an.instanceof(require('stream').Transform);
      done();
    });
  })
  it('Should output raw data', () => {

  })
})
