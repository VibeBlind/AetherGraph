// pages/graph.tsx
import { useState } from 'react';
import AetherGraph2D from '../components/AetherGraph2D';
import NodeCard from '../components/NodeCard';
import type { GraphData, GraphNode } from '../types/graph';
import philoseed from '../data/philoseed.json';

const graphData = philoseed as GraphData;

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-screen h-screen bg-black text-slate-50">
      <div className="flex h-full">
        {/* graph */}
        <div className="flex-1 min-w-0">
          <AetherGraph2D
            data={graphData}
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode?.id ?? null}
          />
        </div>

        {/* side card */}
        <aside className="w-80 border-l border-slate-900 bg-slate-950/90">
          <NodeCard node={selectedNode} />
        </aside>
      </div>
    </div>
  );
}
