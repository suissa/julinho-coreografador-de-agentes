import { Agent } from '../agent';

export class PaymentAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('PaymentAgent execution');
    const updatedPayload = { ...payload, payment: { status: 'completed' } };
    await this.updateSession(updatedPayload);
    this.publish('whatsapp.send', updatedPayload);
  }
}
