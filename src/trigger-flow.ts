import { connect } from 'amqplib';

async function triggerFlow() {
  try {
    const amqpConn = await connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await amqpConn.createChannel();
    const exchange = 'ai.agents';
    const routingKey = 'greeting';

    // Randomly select a user preference to test different workflow paths
    const preferences = ['Date', 'Professional', 'Service'];
    const randomPreference = preferences[Math.floor(Math.random() * preferences.length)];

    const payload = {
      phone: `+55119${Math.floor(100000000 + Math.random() * 900000000)}`, // A unique phone for the session
      user_preference: randomPreference,
    };

    await channel.assertExchange(exchange, 'direct', { durable: false });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)));
    console.log(`[Trigger] Published initial message to ${routingKey} for phone ${payload.phone} with preference "${payload.user_preference}"`);

    setTimeout(() => {
      amqpConn.close();
    }, 500);

  } catch (error) {
    console.error('Error triggering flow:', error);
    process.exit(1);
  }
}

triggerFlow();
