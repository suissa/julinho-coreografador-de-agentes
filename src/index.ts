import { WorkflowEngine } from './workflow-engine';

const engine = new WorkflowEngine('./workflow.json');
engine.start().catch(console.error);
