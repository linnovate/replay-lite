var fs = require('fs');
var Stream = require('stream');

module.exports = gpmd;



function gpmd(config) {

  // default options
  config = Object.assign({
    readableObjectMode: false
  }, config)

  var stream = new Stream.Transform({
    readableObjectMode: config.readableObjectMode,
    transform(chunk, encoding, done) {

      while(chunk.length) {
        if(this.tmpBuffer) {
          chunk = Buffer.concat([this.tmpBuffer, chunk]);
          this.tmpBuffer = null;
        }

        // wait for the next chunk
        if(chunk.length < 8) {
          this.tmpBuffer = chunk;
          chunk = Buffer.alloc(0);
          continue;
        }

        var label, type, val_size, val_num, val_length, value;

        label = chunk.toString('ascii', 0, 4);
        type = chunk[4];

        // no type, move to the next label
        if(type == 0) {
          chunk = chunk.slice(8);
          continue;
        }

        val_size = chunk[5];
        val_num = chunk.readInt16BE(6);
        val_length = val_size * val_num;

        // wait for the next chunk
        if(chunk.length - 8 < val_length) {
          this.tmpBuffer = chunk;
          chunk = Buffer.alloc(0);
          continue;
        }

        value = parse(chunk.slice(8, 8 + val_length), type, val_size)

        // push completed object and clean up for next use
        // console.log({key: label, value: value})
        this.push({key: label, value: value})

        // pack into 4 bytes
        chunk = chunk.slice(8 + Math.ceil(val_length / 4) * 4)
      }

      done()
    }
  })

  if(!config.readableObjectMode) {
    var _push = stream.push.bind(stream);
    stream.push = function(data) {
      _push(JSON.stringify(data))
    }
  }

  return stream;
}


function parse(buf, type, size) {
  type = String.fromCharCode(type)
  switch (type) {
    case 'c':
      return getChar(buf, size);
      break;
    case 'L':
      return buf.readUInt32BE();
      break;
    case 'l':
      return getInt32(buf, size);
      break;
    case 'S':
      return buf.readUInt16BE();
      break;
    case 's':
      return getInt16(buf, size);
      break;
    case 'f':
      return buf.readFloatBE();
      break;
    default:
      throw new Error('unknown data type: ' + type);
  }
}

function getChar(buf, size) {
  var chars = [];
  var length = buf.length / size;
  var i = 0;

  while(chars.length < length) {
    // buf.toString doesn't support extended ascii encoding (range of 128-255).
    // it returns "m/s2" instead of "m/s²".
    // thus, we use fromCharCode instead.
    chars[i] = String.fromCharCode.apply(null, buf.slice(i * size, ++i * size))
  }

  return chars;
}

function getInt32(data, size) {
  var ints = [];
  var i = 0;
  while(i < data.length) {
    var subarr = [];
    for(var j = 0; j < size; j += 4, i += 4) {
      subarr.push(data.readInt32BE(i))
    }
    ints.push(subarr)
  }
  return ints;
}

function getInt16(data, size) {
  var ints = [];
  var i = 0;
  while(i < data.length) {
    var subarr = [];
    for(var j = 0; j < size; j += 2, i += 2) {
      subarr.push(data.readInt16BE(i))
    }
    ints.push(subarr)
  }
  return ints;
}
