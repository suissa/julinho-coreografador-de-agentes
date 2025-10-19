import { Agent } from '../agent';

export class ClientEmailAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ClientEmailAgent execution');
    // Mocked validation and context update
    const updatedPayload = { ...payload, client: { ...payload.client, email: 'john.doe@example.com' } };
    await this.updateSession(updatedPayload);
    this.publish('schedule.new', updatedPayload);
  }
}
