import { Agent } from '../agent';

export class ScheduleNewAgent extends Agent {
  async execute(payload: any): Promise<void> {
    console.log('ScheduleNewAgent execution');
    // Mocked user preference
    const userPref = 'Professional';
    const updatedPayload = { ...payload, schedule: { preference: userPref } };
    await this.updateSession(updatedPayload);

    if (userPref === 'Date') {
      this.publish('schedule.date', updatedPayload);
    } else if (userPref === 'Professional') {
      this.publish('schedule.professional', updatedPayload);
    } else {
      this.publish('schedule.service', updatedPayload);
    }
  }
}
