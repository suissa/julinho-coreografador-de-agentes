import { Agent } from '../agent';

export class ScheduleDateAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ScheduleDateAgent execution');
    const updatedPayload = { ...payload, schedule: { ...payload.schedule, date: '2025-11-20T10:00:00Z' } };
    await this.updateSession(updatedPayload);
    this.publish('payment', updatedPayload);
  }
}
