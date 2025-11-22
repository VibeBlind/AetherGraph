// lib/graphToFlow.ts
import type { GraphData, GraphNode, GraphLink } from '../types/graph';
import type { Node as FlowNode, Edge as FlowEdge } from 'reactflow';
import { MarkerType } from 'reactflow';

const BASE_EDGE_STYLE = {
  stroke: '#64748b',
  strokeWidth: 1.5,
};

export function graphToFlow(
  graph: GraphData
): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = graph.nodes.map((n, idx) => {
    const id = String(n.id);
    const x = (idx % 5) * 300;
    const y = Math.floor(idx / 5) * 200;

    return {
      id,
      type: 'cardNode',
      position: { x, y },
      data: { node: n as GraphNode },
      // optional tiny default, will be replaced on image load
      style: { width: 200, height: 140 },
    };
  });

  const edges: FlowEdge[] = graph.links.map((l, idx) => ({
    id: l.id ? String(l.id) : `e-${idx}`,
    source: String(l.source),
    target: String(l.target),
    type: 'step',
    data: { link: l as GraphLink },
    markerEnd: { type: MarkerType.ArrowClosed },
    reconnectable: true,
    style: BASE_EDGE_STYLE,
  }));

  return { nodes, edges };
}
