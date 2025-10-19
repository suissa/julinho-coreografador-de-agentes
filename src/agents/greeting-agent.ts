import { Agent } from '../agent';

export class GreetingAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('GreetingAgent execution');
    const clientExists = false; // Mocked for now

    if (clientExists) {
      this.publish('schedule.new', payload);
    } else {
      this.publish('client.name', payload);
    }
  }
}
