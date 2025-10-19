import { Channel } from 'amqplib';
import { RedisClientType } from 'redis';
import { Node } from './graph';
import { VM } from 'vm2';

export abstract class Agent {
  constructor(
    protected channel: Channel,
    protected redis: RedisClientType,
    protected session: any
  ) {}

  abstract execute(node: Node, payload: any): Promise<void>;

  protected async publish(routingKey: string, payload: any): Promise<void> {
    const exchange = 'ai.agents'; // This could be dynamic from the graph config
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)));
    console.log(`[${this.constructor.name}] Published to ${routingKey}`);
  }

  protected async updateSession(data: any): Promise<void> {
    const sessionKey = `session:${this.session.phone}`;
    // Merge new data with existing session data
    const updatedSession = { ...this.session, ...data };
    await this.redis.set(sessionKey, JSON.stringify(updatedSession), {
      EX: 300, // This could also be dynamic from the graph config
    });
    console.log(`[${this.constructor.name}] Session updated with:`, data);
  }

  protected evaluateCondition(condition: string, context: any): boolean {
    try {
      const vm = new VM({
        timeout: 100,
        sandbox: context,
      });
      return vm.run(condition);
    } catch (error) {
      console.error(`[${this.constructor.name}] Error evaluating condition "${condition}":`, error);
      return false;
    }
  }
}
