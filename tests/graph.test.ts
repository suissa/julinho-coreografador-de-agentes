import { parseGraph } from '../src/graph';
import * as fs from 'fs';

describe('Graph Parsing', () => {
  it('should parse the workflow.json file without errors', () => {
    const graphJson = JSON.parse(fs.readFileSync('./workflow.json', 'utf-8'));
    const graph = parseGraph(graphJson);
    expect(graph.id).toBe('client_scheduling_flow');
    expect(graph.nodes['greeting']).toBeDefined();
  });

  it('should throw an error for an invalid graph format', () => {
    const invalidGraph = { "invalid": "format" };
    expect(() => parseGraph(invalidGraph)).toThrow('Invalid graph format: missing "graph" property');
  });
});
