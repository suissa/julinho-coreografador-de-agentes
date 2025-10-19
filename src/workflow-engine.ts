import { connect, Channel } from 'amqplib';
import { createClient, RedisClientType } from 'redis';
import { WorkflowGraph, parseGraph } from './graph';
import { NodeExecutor } from './node-executor';
import * as fs from 'fs';

export class WorkflowEngine {
  private channel!: Channel;
  private redis!: RedisClientType;
  private nodeExecutor!: NodeExecutor;
  private graph!: WorkflowGraph;

  constructor(private graphPath: string) {}

  async start(): Promise<void> {
    const amqpConn = await connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await amqpConn.createChannel();

    this.redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await this.redis.connect();

    this.nodeExecutor = new NodeExecutor(this.channel, this.redis);
    this.graph = parseGraph(JSON.parse(fs.readFileSync(this.graphPath, 'utf-8')));

    const exchange = this.graph.exchange;
    await this.channel.assertExchange(exchange, 'direct', { durable: false });

    console.log('WorkflowEngine started, waiting for messages...');

    for (const node of Object.values(this.graph.nodes)) {
      const routingKey = node.id;
      const queueName = `${this.graph.id}:${routingKey}`;
      await this.channel.assertQueue(queueName, { durable: false });
      this.channel.bindQueue(queueName, exchange, routingKey);
      this.channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const payload = JSON.parse(msg.content.toString());
            console.log(`[${routingKey}] Received message:`, payload);

            const node = this.graph.nodes[routingKey];
            if (node) {
              await this.nodeExecutor.execute(node, payload);
            } else {
              console.error(`Node with id "${routingKey}" not found in graph`);
            }
            this.channel.ack(msg);
          } catch (error) {
            console.error(`Error processing message for ${routingKey}:`, error);
            this.channel.nack(msg, false, false);
          }
        }
      });
    }
  }
}
