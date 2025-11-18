// components/CardNode.tsx
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { GraphNode } from '../types/graph';

type CardNodeData = {
  node: GraphNode;
};

export default function CardNode({ data }: NodeProps<CardNodeData>) {
  const raw = data.node;
  const meta: Record<string, unknown> = { ...raw };
  delete meta.id;

  const title =
    (meta.label as string) ??
    (meta.title as string) ??
    (meta.name as string) ??
    String(raw.id);

  const type =
    (meta.type as string) ??
    (meta.kind as string) ??
    undefined;

  const description =
    typeof meta.description === 'string'
      ? (meta.description as string)
      : '';

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/90 text-slate-50 shadow-lg shadow-black/40 min-w-[220px] max-w-[320px]">
      <div className="px-3 pt-3 pb-2 border-b border-slate-800">
        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
          Node
        </div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">
            {title}
          </h3>
          {type && (
            <span className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
              {type}
            </span>
          )}
        </div>
      </div>
      <div className="px-3 py-2 text-xs text-slate-300 space-y-2">
        {description && (
          <p className="line-clamp-4">
            {description}
          </p>
        )}
        <div className="text-[10px] text-slate-500">
          id: <span className="text-slate-300">{String(raw.id)}</span>
        </div>
      </div>

      {/* connection handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
