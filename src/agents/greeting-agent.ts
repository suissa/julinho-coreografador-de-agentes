import { Agent } from '../agent';
import { Node } from '../graph';

export class GreetingAgent extends Agent {
  async execute(node: Node, payload: any): Promise<void> {
    console.log(`[${this.constructor.name}] Executing`);

    // In a real application, this would involve a database lookup.
    // We simulate this lookup and create a context for the condition evaluation.
    const clientExists = Math.random() < 0.5; // Simulate if client exists
    const context = { client_exists: clientExists };
    console.log(`[${this.constructor.name}] Client lookup simulation. client_exists = ${clientExists}`);

    // Update the session with the result of the lookup
    await this.updateSession(context);

    if (!node.actions || node.actions.length === 0) {
      console.error(`[${this.constructor.name}] No actions defined for this node.`);
      return;
    }

    // Find the first action whose condition evaluates to true
    for (const action of node.actions) {
      if (this.evaluateCondition(action.condition, context)) {
        console.log(`[${this.constructor.name}] Condition "${action.condition}" is true. Publishing to "${action.publish_to}".`);
        await this.publish(action.publish_to, { ...payload, ...context });
        return; // Stop after the first matching action
      }
    }

    console.error(`[${this.constructor.name}] No condition matched. Halting workflow.`);
  }
}
