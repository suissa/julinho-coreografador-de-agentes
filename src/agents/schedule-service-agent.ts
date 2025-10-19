import { Agent } from '../agent';

export class ScheduleServiceAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ScheduleServiceAgent execution');
    const updatedPayload = { ...payload, schedule: { ...payload.schedule, service: 'Haircut' } };
    await this.updateSession(updatedPayload);
    this.publish('payment', updatedPayload);
  }
}
