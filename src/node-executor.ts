import { Channel } from 'amqplib';
import { RedisClientType } from 'redis';
import { Node } from './graph';
import { Agent } from './agent';
import * as agents from './agents'; // We'll use namespace import

export class NodeExecutor {
  constructor(
    private channel: Channel,
    private redis: RedisClientType
  ) {}

  async execute(node: Node, payload: any): Promise<void> {
    const sessionKey = `session:${payload.phone}`;
    const sessionData = await this.redis.get(sessionKey) || '{}';
    const session = JSON.parse(sessionData);

    const agentName = node.agent;
    const AgentClass = (agents as any)[agentName];

    if (!AgentClass) {
      throw new Error(`Agent ${agentName} not found`);
    }

    const agentInstance: Agent = new AgentClass(this.channel, this.redis, { ...session, ...payload });
    await agentInstance.execute(payload);
  }
}
