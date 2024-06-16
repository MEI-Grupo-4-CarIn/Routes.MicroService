const amqp = require("amqplib/callback_api");
const RoutePersistence = require("../use_cases/routePersistence");
const Logger = require("../frameworks/logging/logger");

let channel = null;
const routePersistence = new RoutePersistence();

function handleMessage(msg) {
  const eventData = JSON.parse(msg.content.toString());
  console.log(`Received event: ${eventData.action}`);

  routePersistence
    .recalculateRoute(eventData)
    .then(() => console.log("Route recalculation successful."))
    .catch((error) => {
      console.error("Error recalculating route from event:", error);
      Logger.error(`Error recalculating route from event:`, error);
    });
}

function subscribeToQueue(queueName) {
  amqp.connect(process.env.RABBITMQ_URI, (error0, conn) => {
    if (error0) {
      throw error0;
    }
    conn.createChannel((error1, ch) => {
      if (error1) {
        throw error1;
      }
      channel = ch;
      ch.assertQueue(queueName, { durable: true });
      ch.consume(queueName, handleMessage, { noAck: true });
      console.log(`Subscribed to queue: ${queueName}`);
    });
  });
}

function publishToQueue(queue, message) {
  if (!channel) {
    console.error("RabbitMQ channel is not initialized. Cannot publish message.");
    return;
  }
  channel.assertQueue(queue, {
    durable: true,
  });
  channel.sendToQueue(queue, Buffer.from(message));
}

module.exports = {
  subscribeToQueue,
  publishToQueue,
};
