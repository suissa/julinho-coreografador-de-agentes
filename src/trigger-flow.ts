import { connect } from 'amqplib';

async function triggerFlow() {
  try {
    const amqpConn = await connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await amqpConn.createChannel();
    const exchange = 'ai.agents';
    const routingKey = 'greeting';

    const payload = {
      phone: '+5511999999999', // A unique identifier for the session
      // Add any other initial data needed by the GreetingAgent
    };

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)));
    console.log(`[Trigger] Published initial message to ${routingKey} for phone ${payload.phone}`);

    // The script should exit gracefully, so we close the connection.
    // We add a small delay to ensure the message is sent before closing.
    setTimeout(() => {
      amqpConn.close();
    }, 500);

  } catch (error) {
    console.error('Error triggering flow:', error);
    process.exit(1);
  }
}

triggerFlow();
