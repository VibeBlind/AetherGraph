// components/CardNode.tsx
import * as React from 'react';
import {
  Handle,
  Position,
  NodeResizer,
  useReactFlow,
  type NodeProps,
} from 'reactflow';
import type { GraphNode } from '../types/graph';

type CardNodeData = { node: GraphNode };

const SLOT_OFFSETS = [25, 50, 75];
const GRID_SIZE = 24;

const PORTRAITS: Record<string, string> = {
  plato: '/portraits/plato.jpg',
  aristotle: '/portraits/aristotle.jpg',
  'immanuel-kant': '/portraits/kant.jpg',
  'friedrich-nietzsche': '/portraits/nietzsche.jpg',
};

type MediaKind = 'image' | 'video';
type MediaSpec = { src: string | null; kind: MediaKind; poster?: string | null };

function slugName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pickMedia(raw: any): MediaSpec {
  const explicitVideo = raw.videoUrl ?? raw.video ?? null;
  const explicitImage =
    raw.imageUrl ??
    raw.image ??
    raw.thumbnail ??
    raw.portrait ??
    null;

  if (explicitVideo) {
    return {
      src: String(explicitVideo),
      kind: 'video',
      poster: explicitImage ? String(explicitImage) : undefined,
    };
  }

  if (explicitImage) {
    const src = String(explicitImage);
    const urlPath = src.split('#')[0].split('?')[0];
    const ext = urlPath.split('.').pop()?.toLowerCase();

    if (ext && ['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      return { src, kind: 'video' };
    }

    return { src, kind: 'image' };
  }

  const name =
    raw.label ??
    raw.title ??
    raw.name ??
    raw.id ??
    null;

  if (name) {
    const slug = slugName(String(name));
    if (PORTRAITS[slug]) {
      return { src: PORTRAITS[slug], kind: 'image' };
    }

    const bg = '020617';
    const fg = 'e5e7eb';
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      String(name)
    )}&background=${bg}&color=${fg}&size=256`;
    return { src: avatar, kind: 'image' };
  }

  return { src: null, kind: 'image' };
}

export default function CardNode({ id, data, selected }: NodeProps<CardNodeData>) {
  const raw = data.node as any;

  const title =
    raw.label ??
    raw.title ??
    raw.name ??
    String(raw.id);

  const media = pickMedia(raw);

  const { setNodes } = useReactFlow();
  const sizedOnce = React.useRef(false);

  // snap a scalar to nearest GRID_SIZE multiple, with a minimum of one step
  const snapScalar = (v: number) =>
    Math.max(GRID_SIZE, Math.round(v / GRID_SIZE) * GRID_SIZE);

  const applySize = (width: number, height: number) => {
    if (sizedOnce.current) return;
    if (!width || !height) return;

    const MAX_DIM = 420;
    const scale = Math.min(1, MAX_DIM / Math.max(width, height));
    const w = width * scale;
    const h = height * scale;

    const snappedW = snapScalar(w);
    const snappedH = snapScalar(h);

    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id !== id) return n;

        const x = n.position.x ?? 0;
        const y = n.position.y ?? 0;

        const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;

        return {
          ...n,
          position: { x: snappedX, y: snappedY },
          style: {
            ...(n.style || {}),
            width: snappedW,
            height: snappedH,
          },
        };
      })
    );

    sizedOnce.current = true;
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    applySize(img.naturalWidth || img.width, img.naturalHeight || img.height);
  };

  const handleVideoMeta = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    applySize(v.videoWidth || v.clientWidth, v.videoHeight || v.clientHeight);
  };

  return (
    <div className="relative select-none w-full h-full">
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={90}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          border: '1px solid #e5e7eb',
          background: '#020617',
        }}
      />

      <div className="w-full h-full overflow-hidden rounded-[24px] border border-slate-800 bg-black/90 shadow-xl shadow-black/70">
        {media.src ? (
          media.kind === 'video' ? (
            <video
              src={media.src}
              poster={media.poster}
              className="block w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onLoadedMetadata={handleVideoMeta}
            />
          ) : (
            <img
              src={media.src}
              alt={title}
              className="block w-full h-full object-cover"
              onLoad={handleImageLoad}
            />
          )
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-900">
            <span className="px-3 text-[11px] text-slate-300 text-center">
              {title}
            </span>
          </div>
        )}
      </div>

      {SLOT_OFFSETS.map((offset, index) => (
        <Handle
          key={`left-${index}`}
          id={`left-${index}`}
          type="source"
          position={Position.Left}
          className="aether-handle"
          style={{ top: `${offset}%` }}
        />
      ))}

      {SLOT_OFFSETS.map((offset, index) => (
        <Handle
          key={`right-${index}`}
          id={`right-${index}`}
          type="source"
          position={Position.Right}
          className="aether-handle"
          style={{ top: `${offset}%` }}
        />
      ))}

      {SLOT_OFFSETS.map((offset, index) => (
        <Handle
          key={`top-${index}`}
          id={`top-${index}`}
          type="source"
          position={Position.Top}
          className="aether-handle"
          style={{ left: `${offset}%` }}
        />
      ))}

      {SLOT_OFFSETS.map((offset, index) => (
        <Handle
          key={`bottom-${index}`}
          id={`bottom-${index}`}
          type="source"
          position={Position.Bottom}
          className="aether-handle"
          style={{ left: `${offset}%` }}
        />
      ))}
    </div>
  );
}
