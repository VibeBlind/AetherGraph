import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import type { ForceGraphMethods } from 'react-force-graph-2d';
import type { GraphData, GraphNode } from '../types/graph';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface AetherGraph2DProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
}

// metadata helpers
const getNodeLabel = (node: GraphNode): string =>
  (node as any).label ??
  (node as any).title ??
  (node as any).name ??
  String(node.id);

const getNodeType = (node: GraphNode): string | undefined =>
  (node as any).type ?? (node as any).kind ?? undefined;

export default function AetherGraph2D({ data, onNodeClick }: AetherGraph2DProps) {
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // container-based resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // zoom to fit on size/data change
  useEffect(() => {
    if (!fgRef.current) return;
    if (!dimensions.width || !dimensions.height) return;

    try {
      fgRef.current.zoomToFit(400);
    } catch {
      // ignore; retry on next change
    }
  }, [dimensions, data]);

  const handleNodeClick = useCallback(
    (node: any) => {
      if (onNodeClick) onNodeClick(node as GraphNode);
    },
    [onNodeClick]
  );

  const handleNodeHover = useCallback((node: any) => {
    document.body.style.cursor = node ? 'pointer' : 'default';
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-black">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#000000"
        nodeAutoColorBy="group"
        linkColor={() => 'rgba(255, 255, 255, 0.2)'}
        nodeLabel={(node: any) => getNodeLabel(node as GraphNode)}
        nodeCanvasObjectMode={() => 'replace'}
        nodeCanvasObject={(nodeObj, ctx, globalScale) => {
          const node = nodeObj as GraphNode;
          const label = getNodeLabel(node);
          const type = getNodeType(node);

          const fontSize = 12 / globalScale;
          const radius = 4 / globalScale;

          // node body
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'white';
          ctx.fill();

          // label
          ctx.font = `${fontSize}px 'EB Garamond', Garamond, serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.fillText(label, node.x! + radius + 2, node.y!);

          // type tag
          if (type) {
            const typeText = String(type);
            const padX = 3 / globalScale;
            const padY = 1 / globalScale;
            const tagFontSize = 9 / globalScale;

            const metrics = ctx.measureText(typeText);
            const tagWidth = metrics.width + padX * 2;
            const tagHeight = tagFontSize + padY * 2;

            const tagX = node.x! + radius + 2;
            const tagY = node.y! + fontSize;

            ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.fillRect(tagX, tagY - tagHeight / 2, tagWidth, tagHeight);

            ctx.font = `${tagFontSize}px 'EB Garamond', Garamond, serif`;
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.fillText(typeText, tagX + padX, tagY);
          }
        }}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
      />
    </div>
  );
}