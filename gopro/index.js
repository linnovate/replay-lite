const fs = require('fs');
const path = require('path');
const Stream = require('stream');
const gpmd = require('../utils/gpmd');
const rabbitmq = require('../utils/rabbitmq');
const mongooseConnect = require('../utils/mongoose-connect');
const GoPro = require('../models/gopro');
mongooseConnect()

const url = process.env.RABBITMQ_URL || 'amqp://localhost';
const queue = 'GoProFile';

var attempts = 5;

rabbitmq({ queue }, function(conn, ch) {
  ch.consume(queue, function(msg) {
    const file = msg.content.toString();
    gpmd.decodeFile(file, {
      readableObjectMode: true
    }, (stream) => {
      stream
        .on('pipe', () => {
          console.log('Decoding file ' + file + '...')
        })
        .on('error', (err) => {
          throw err;
        })
        .pipe(geo({
          duration: stream.duration,
        }))
        .on('index', (id) => {
          var dest = path.format({
            dir: path.dirname(file).replace('dropfolder', 'video'),
            ext: path.extname(file),
            name: id
          })
          console.log('Moving file ' + path.basename(file) + ' to ' + dest)
          fs.rename(file, dest, function(err) {
            if(err) throw err;
            console.log('Finished')
            ch.ack(msg);
          });
        })
    })
  });
});

function geo(options) {

  if(!options.duration) {
    console.warn('No video duration specified')
  }

  var range = {
    start: 0,
    end: 0,
    gps: null
  };
  var entry = {
    start: 0,
    end: 0,
    gps: null
  }
  var doc = {
    geo: {
      type: 'LineString',
      coordinates: []
    },
    time: []
  }

  var stream = new Stream.Writable({
    objectMode: true
  })

  stream._write = function(data, encoding, done) {
    if(data.key == 'GPSU') {
      range.end = gpmd.utils.gpsu2date(data.value[0]);
      if(range.gps && range.start) {
        handle_gps_entry()
      }
      range.start = range.end
    } else if(data.key == 'GPS5') {
      range.gps = data.value;
    }
    done()
  }

  stream.end = function() {
    if(options.duration > entry.end) {
      range.end = range.start + (options.duration - entry.end);
      handle_gps_entry();
      handle_entry(entry);
      if(doc.geo.coordinates.length == 1) {
        doc.geo.type = 'Point';
        doc.geo.coordinates = doc.geo.coordinates[0];
      }
      GoPro.create(doc, function(err, doc) {
        if(err) {
          console.error(err)
        }
        stream.emit('index', doc._id)
      })
    } else if(options.duration < entry.end) {
      console.warn('Wrong duration ' + options.duration + ' smaller than ' + entry.end)
    }
  }

  function handle_gps_entry() {
    var entryRange = (range.end - range.start) / range.gps.length;
    if(!doc.time.length) doc.time.push(new Date(range.start));
    range.gps.forEach((gps) => {
      gps = gps.slice(0,2).toString()
      if(gps == entry.gps) {
        entry.end += entryRange;
      } else {
        if(entry.end && entry.gps) {
          handle_entry(entry);
        }
        entry.start = entry.end;
        entry.end += entryRange;
        entry.gps = gps;
      }
    })
  }


  function handle_entry(entry) {
    var gps = entry.gps.split(',').map(v => v / 10000000).reverse();
    doc.geo.coordinates.push(gps);
    doc.time.push(new Date(doc.time[0].getTime() + new Date(entry.end).getTime()))
  }

/*  function handle_entry(data) {
    console.log(JSON.stringify(entry,null,2))
  }*/

  return stream;
}
