import { Channel } from 'amqplib';
import { RedisClientType } from 'redis';

export abstract class Agent {
  constructor(
    protected channel: Channel,
    protected redis: RedisClientType,
    protected session: any
  ) {}

  abstract execute(payload: any): Promise<void>;

  protected async publish(routingKey: string, payload: any): Promise<void> {
    const exchange = 'ai.agents'; // Hardcoded for now, could be from graph
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)));
    console.log(`[${this.constructor.name}] Published to ${routingKey}`);
  }

  protected async updateSession(data: any): Promise<void> {
    const sessionKey = `session:${this.session.phone}`;
    await this.redis.set(sessionKey, JSON.stringify({ ...this.session, ...data }), {
      EX: 300,
    });
    console.log(`[${this.constructor.name}] Session updated`);
  }
}
