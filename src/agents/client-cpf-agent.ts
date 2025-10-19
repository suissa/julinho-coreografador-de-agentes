import { Agent } from '../agent';

export class ClientCPFAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ClientCPFAgent execution');
    // Mocked validation and context update
    const updatedPayload = { ...payload, client: { ...payload.client, cpf: '123.456.789-00' } };
    await this.updateSession(updatedPayload);
    this.publish('client.email', updatedPayload);
  }
}
