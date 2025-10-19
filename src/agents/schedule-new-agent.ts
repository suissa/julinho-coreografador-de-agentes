import { Agent } from '../agent';
import { Node } from '../graph';

export class ScheduleNewAgent extends Agent {
  async execute(node: Node, payload: any): Promise<void> {
    console.log(`[${this.constructor.name}] Executing`);

    // In a real application, the agent would ask the user for their preference.
    // We'll get it from the payload, which will be provided by our trigger script.
    const userPref = payload.user_preference;
    if (!userPref) {
      console.error(`[${this.constructor.name}] User preference not found in payload. Halting.`);
      // Here, you might re-prompt the user. For now, we'll stop.
      return;
    }

    const context = { userPref: userPref };
    console.log(`[${this.constructor.name}] User preference is "${userPref}".`);

    // Update the session with the user's preference
    await this.updateSession({ schedule: { preference: userPref } });

    if (!node.decisions || node.decisions.length === 0) {
      console.error(`[${this.constructor.name}] No decisions defined for this node.`);
      return;
    }

    // Find the first decision whose condition evaluates to true
    for (const decision of node.decisions) {
      if (this.evaluateCondition(decision.condition, context)) {
        console.log(`[${this.constructor.name}] Condition "${decision.condition}" is true. Publishing to "${decision.publish_to}".`);
        await this.publish(decision.publish_to, { ...payload, ...context });
        return; // Stop after the first matching decision
      }
    }

    console.error(`[${this.constructor.name}] No decision condition matched. Halting workflow.`);
  }
}
