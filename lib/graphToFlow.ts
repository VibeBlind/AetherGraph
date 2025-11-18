import type { GraphData, GraphNode, GraphLink } from '../types/graph';
import type { Node as FlowNode, Edge as FlowEdge } from 'reactflow';

export function graphToFlow(
  graph: GraphData
): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = graph.nodes.map((n, idx) => {
    const id = String(n.id);

    // crude initial layout: grid-ish
    const x = (idx % 5) * 300;
    const y = Math.floor(idx / 5) * 200;

    return {
      id,
      type: 'cardNode',
      position: { x, y },
      data: {
        node: n as GraphNode,
      },
    };
  });

  const edges: FlowEdge[] = graph.links.map((l, idx) => ({
    id: l.id ? String(l.id) : `e-${idx}`,
    source: String(l.source),
    target: String(l.target),
    type: 'default',
    data: { link: l as GraphLink },
  }));

  return { nodes, edges };
}