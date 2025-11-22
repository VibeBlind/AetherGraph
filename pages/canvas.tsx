// pages/canvas.tsx
import { useMemo, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  reconnectEdge,
  addEdge,
  type Connection,
  ConnectionMode, 
} from 'reactflow';

import type { GraphData, GraphNode } from '../types/graph';
import philoseed from '../data/philoseed.json';
import CardNode from '../components/CardNode';
import { graphToFlow } from '../lib/graphToFlow';

const nodeTypes: NodeTypes = {
  cardNode: CardNode,
};

const graphData = philoseed as GraphData;
const GRID_SIZE = 24;

function CanvasInner() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => graphToFlow(graphData),
    []
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const edgeReconnectSuccessful = useRef(true);

  const selectedEdge = selectedEdgeId
    ? edges.find((e) => e.id === selectedEdgeId) ?? null
    : null;

  const handleNodeClick = useCallback((_: any, node: any) => {
    const data = (node.data as any)?.node as GraphNode | undefined;
    setSelectedNode(data ?? null);
    setSelectedEdgeId(null);
  }, []);

  const handleEdgeClick = useCallback((_: any, edge: any) => {
    setSelectedEdgeId(edge.id as string);
    setSelectedNode(null);
  }, []);

  // Create new edge by dragging from any handle to any handle
  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: `e-${Date.now()}-${eds.length}`,
            type: 'step',          // default shape; editable in inspector
            reconnectable: true,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Reconnect existing edge: begin drag
  const handleReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  // Reconnect existing edge: drop on a handle = success
  const handleReconnect = useCallback(
    (oldEdge: any, newConnection: any) => {
      edgeReconnectSuccessful.current = true;
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
    [setEdges]
  );

  // Reconnect existing edge: drop in empty space = delete edge
  const handleReconnectEnd = useCallback(
    (_: any, edge: any) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        if (selectedEdgeId === edge.id) {
          setSelectedEdgeId(null);
        }
      }
      edgeReconnectSuccessful.current = true;
    },
    [setEdges, selectedEdgeId]
  );

  const handleCloseInspector = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdgeId(null);
  }, []);

  const handleEdgeTypeChange = useCallback(
    (newType: string) => {
      if (!selectedEdgeId) return;
      setEdges((eds) =>
        eds.map((e) =>
          e.id === selectedEdgeId ? { ...e, type: newType as any } : e
        )
      );
    },
    [setEdges, selectedEdgeId]
  );

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
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onConnect={handleConnect}
            onReconnectStart={handleReconnectStart}
            onReconnect={handleReconnect}
            onReconnectEnd={handleReconnectEnd}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            snapToGrid
            snapGrid={[GRID_SIZE, GRID_SIZE]}
            connectionMode={ConnectionMode.Loose}
          >
            <Background gap={GRID_SIZE} size={1} />
            <Controls />
          </ReactFlow>
        </div>

        {/* inspector: node or edge */}
        {(selectedNode || selectedEdge) && (
          <aside className="w-80 border-l border-slate-900 bg-slate-950/90">
            <div className="h-full p-4 text-sm flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  {selectedNode ? 'Selected node' : 'Selected edge'}
                </div>
                <button
                  type="button"
                  onClick={handleCloseInspector}
                  className="text-slate-400 hover:text-slate-100 text-xs px-2 py-1 rounded-md hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {selectedNode && (
                <>
                  <div className="text-base font-semibold mb-1">
                    {(selectedNode as any).label ??
                      (selectedNode as any).title ??
                      (selectedNode as any).name ??
                      String(selectedNode.id)}
                  </div>
                  <pre className="mt-3 text-[11px] bg-slate-900/80 border border-slate-800 rounded-xl p-3 overflow-auto flex-1">
                    {JSON.stringify(selectedNode, null, 2)}
                  </pre>
                </>
              )}

              {selectedEdge && !selectedNode && (
                <>
                  <div className="text-xs text-slate-300 mb-2 space-y-1">
                    <div>
                      <span className="text-slate-500">id:</span>{' '}
                      <span>{String(selectedEdge.id)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">from:</span>{' '}
                      <span>{selectedEdge.source}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">to:</span>{' '}
                      <span>{selectedEdge.target}</span>
                    </div>
                    {selectedEdge.sourceHandle && (
                      <div>
                        <span className="text-slate-500">source handle:</span>{' '}
                        <span>{selectedEdge.sourceHandle}</span>
                      </div>
                    )}
                    {selectedEdge.targetHandle && (
                      <div>
                        <span className="text-slate-500">target handle:</span>{' '}
                        <span>{selectedEdge.targetHandle}</span>
                      </div>
                    )}
                  </div>

                  <label className="text-[11px] text-slate-400 mb-2">
                    Edge style
                    <select
                      className="mt-1 block w-full bg-slate-900/80 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-100"
                      value={selectedEdge.type ?? 'default'}
                      onChange={(e) => handleEdgeTypeChange(e.target.value)}
                    >
                      <option value="default">Default (curved)</option>
                      <option value="step">Angular (step)</option>
                      <option value="smoothstep">Smooth step</option>
                      <option value="straight">Straight</option>
                    </select>
                  </label>

                  <pre className="mt-3 text-[11px] bg-slate-900/80 border border-slate-800 rounded-xl p-3 overflow-auto flex-1">
                    {JSON.stringify(selectedEdge, null, 2)}
                  </pre>
                </>
              )}
            </div>
          </aside>
        )}
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
