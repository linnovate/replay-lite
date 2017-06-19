const mongoose = require('mongoose');
const maxAttempts = 5;

module.exports = function(url, options) {

  url = url || process.env.MONGODB_URL || 'mongodb://localhost/replay';
  options = Object.assign({
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    server: {
      auto_reconnect: true,
    }
  }, options)

  mongoose.connect(url, options);

  var attempts = 0;
  mongoose.connection
  .on('connected', function() {
    attempts = 0;
    console.log('connected to ' + url)
  })
  .on('error', function(err) {
    if(attempts++ < maxAttempts) {
      console.log('connection attempt...')
      setTimeout(() => {
        mongoose.connect(url, options);
      }, 2000);
    } else {
      throw err;
    }
  })
  .on('close', function() {
    console.log('closed')
  })
}
