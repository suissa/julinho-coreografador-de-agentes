import { Agent } from '../agent';

export class ClientBirthDateAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ClientBirthDateAgent execution');
    // Mocked validation and context update
    const updatedPayload = { ...payload, client: { ...payload.client, birthDate: '1990-01-01' } };
    await this.updateSession(updatedPayload);
    this.publish('client.cpf', updatedPayload);
  }
}
