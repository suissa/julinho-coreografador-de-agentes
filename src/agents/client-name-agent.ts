import { Agent } from '../agent';

export class ClientNameAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ClientNameAgent execution');
    // Mocked validation and context update
    const updatedPayload = { ...payload, client: { name: 'John Doe' } };
    await this.updateSession(updatedPayload);
    this.publish('client.birthdate', updatedPayload);
  }
}
