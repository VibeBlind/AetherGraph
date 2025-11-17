// pages/graph.tsx
import { useRouter } from 'next/router';
import AetherGraph2D from '../components/AetherGraph2D';
import type { GraphData, GraphNode } from '../types/graph';

import philoseed from '../data/philoseed.json';
// import kantWiki from '../data/wiki-Immanuel_Kant.json';

const graphData = philoseed as GraphData;
// const graphData = kantWiki as GraphData;

export default function GraphPage() {
  const router = useRouter();

  const handleNodeClick = (node: GraphNode) => {
    const id = encodeURIComponent(String(node.id));
    router.push(`/node/${id}`);
  };

  return (
    <div className="w-screen h-screen">
      <AetherGraph2D data={graphData} onNodeClick={handleNodeClick} />
    </div>
  );
}
