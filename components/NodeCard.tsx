// components/NodeCard.tsx
import Link from 'next/link';
import type { GraphNode } from '../types/graph';

interface NodeCardProps {
  node: GraphNode | null;
}

export default function NodeCard({ node }: NodeCardProps) {
  if (!node) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-500">
        Click a node to see details.
      </div>
    );
  }

  const meta: Record<string, unknown> = { ...node };
  delete meta.id;
  delete meta.x;
  delete meta.y;
  delete meta.vx;
  delete meta.vy;
  delete meta.fx;
  delete meta.fy;

  const title =
    (meta.label as string) ??
    (meta.title as string) ??
    (meta.name as string) ??
    String(node.id);

  const type =
    (meta.type as string) ??
    (meta.kind as string) ??
    undefined;

  return (
    <div className="h-full flex flex-col bg-slate-950/80 border border-slate-800 rounded-2xl shadow-lg shadow-black/40">
      {/* header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Selected node
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              {title}
            </h2>
            {type && (
              <div className="mt-1 inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                {type}
              </div>
            )}
          </div>
          <Link
            href={`/node/${encodeURIComponent(String(node.id))}`}
            className="text-[11px] text-sky-300 hover:text-sky-100 underline-offset-2 hover:underline"
          >
            Open full page
          </Link>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 overflow-auto px-4 py-3 space-y-4 text-sm">
        <dl className="space-y-2 text-xs">
          <div className="flex gap-2">
            <dt className="w-20 text-slate-500">id</dt>
            <dd className="flex-1 text-slate-200">
              {String(node.id)}
            </dd>
          </div>

          {Object.entries(meta)
            .filter(([key]) => !['label', 'title', 'name', 'type', 'kind'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <dt className="w-20 text-slate-500">{key}</dt>
                <dd className="flex-1 text-slate-200">
                  {typeof value === 'string' || typeof value === 'number'
                    ? String(value)
                    : JSON.stringify(value)}
                </dd>
              </div>
            ))}
        </dl>

        {/* crude description stub */}
        <div className="text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          Add fields like&nbsp;
          <code className="bg-slate-950 px-1 py-0.5 rounded">
            description
          </code>
          &nbsp;or&nbsp;
          <code className="bg-slate-950 px-1 py-0.5 rounded">
            source
          </code>
          &nbsp;to your dataset to enrich this card.
        </div>
      </div>
    </div>
  );
}
