const rabbitmq = require('./rabbitmq');

const url = process.env.RABBITMQ_URL || 'amqp://localhost';

module.exports = function(queue, msg) {
  rabbitmq({ queue }, function(conn, ch) {
    ch.sendToQueue(queue, Buffer.from(msg), {}, function(err, ok) {
      conn.close();
    });
  })
}
