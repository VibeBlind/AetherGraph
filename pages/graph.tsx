import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { ForceGraphMethods } from 'react-force-graph-2d';
import philoseed from '../data/philoseed.json';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function GraphPage() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom to fit when size or data changes
  useEffect(() => {
    if (fgRef.current) {
      try {
        fgRef.current.zoomToFit(400);
        setIsReady(true);
      } catch (err) {
        console.warn('ForceGraph zoomToFit failed:', err);
      }
    }
  }, [dimensions, philoseed]);

  return (
    <div className="w-full h-screen bg-black">
      <ForceGraph2D
        ref={fgRef}
        graphData={philoseed}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#000000"
        nodeAutoColorBy="group"
        linkColor={() => 'rgba(255, 255, 255, 0.2)'}
        nodeLabel="id"
        nodeCanvasObjectMode={() => undefined}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = String(node.id);
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px 'EB Garamond', Garamond, serif`;
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, node.x!, node.y!);
        }}
        onNodeClick={(node) => {
          window.location.href = `/node/${encodeURIComponent(node.id)}`;
        }}
        onNodeHover={() => (document.body.style.cursor = 'pointer')}
      />
    </div>
  );
}