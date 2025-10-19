import { Agent } from '../agent';

export class ScheduleProfessionalAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ScheduleProfessionalAgent execution');
    const updatedPayload = { ...payload, schedule: { ...payload.schedule, professional: 'Dr. Smith' } };
    await this.updateSession(updatedPayload);
    this.publish('payment', updatedPayload);
  }
}
