const fs = require('fs');
const path = require('path');
const Stream = require('stream');

module.exports = {
  decodeStream: require('./decode-stream'),
  decodeFile: require('./decode-file'),
  utils: {
    gpsu2date: function(string) {
      dateArr = string.toString()
        .match(/\d{1,3}$|\d{1,2}/g)
        .map(i => parseInt(i));
      dateArr[0] += 2000;
      dateArr[1] -= 1;
      return Date.UTC.apply(new Date, dateArr)
    }
  }
}
