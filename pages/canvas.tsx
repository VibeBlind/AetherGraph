// pages/canvas.tsx
import { useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import type { GraphData, GraphNode } from '../types/graph';
import philoseed from '../data/philoseed.json';
import CardNode from '../components/CardNode';
import { graphToFlow } from '../lib/graphToFlow';

const nodeTypes: NodeTypes = {
  cardNode: CardNode,
};

const graphData = philoseed as GraphData;

function CanvasInner() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => graphToFlow(graphData),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  return (
    <div className="w-screen h-screen bg-black text-slate-50">
      <div className="flex h-full">
        {/* canvas */}
        <div className="flex-1 min-w-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            onNodeClick={(_, node) => {
              const data = (node.data as any)?.node as GraphNode | undefined;
              if (data) setSelectedNode(data);
            }}
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>

        {/* side inspector */}
        <aside className="w-80 border-l border-slate-900 bg-slate-950/90">
          <div className="h-full p-4 text-sm">
            {!selectedNode ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                Click a card to inspect.
              </div>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                  Selected node
                </div>
                <div className="text-base font-semibold mb-1">
                  {(selectedNode as any).label ??
                    (selectedNode as any).title ??
                    (selectedNode as any).name ??
                    String(selectedNode.id)}
                </div>
                <pre className="mt-3 text-[11px] bg-slate-900/80 border border-slate-800 rounded-xl p-3 overflow-auto">
                  {JSON.stringify(selectedNode, null, 2)}
                </pre>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
