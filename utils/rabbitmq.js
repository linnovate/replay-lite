const amqp = require('amqplib/callback_api');
const url = process.env.RABBITMQ_URL || 'amqp://localhost';

var attempts = 10;

module.exports = function connect(opts, callback) {

  amqp.connect(url, function(err, conn) {

    if(err) {
      if(attempts--) {
        return setTimeout(() => {
          connect(opts, callback)
        }, 2000);
      } else {
        throw err;
      }
    }

    console.log('connected to ' + url)

    conn.createConfirmChannel(function(err, ch) {
      if(err) throw err;

      ch.assertQueue(opts.queue, {durable: false}, function(err, ok) {
        if(err) throw err;

        callback(conn, ch)
      });
    });
  });
}
