import type { GraphNode } from '../types/graph';

type NodeInspectorProps = {
  node: GraphNode | null;
};

export default function NodeInspector({ node }: NodeInspectorProps) {
  if (!node) return null;

  const raw = node as any;
  const meta: Record<string, unknown> = { ...raw };
  delete meta.id;

  const title =
    (raw.label as string) ??
    (raw.title as string) ??
    (raw.name as string) ??
    String(raw.id);

  const type =
    (raw.type as string) ??
    (raw.kind as string) ??
    undefined;

  const description =
    typeof raw.description === 'string' ? (raw.description as string) : '';

  return (
    <div className="h-full p-4 text-sm text-slate-50">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
        Selected node
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <h2 className="text-base font-semibold leading-snug">
          {title}
        </h2>
        {type && (
          <span className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
            {type}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-300 mb-3">
          {description}
        </p>
      )}

      <div className="mb-3 text-[11px] text-slate-500">
        id: <span className="text-slate-300">{String(raw.id)}</span>
      </div>

      <div className="mt-3 text-[11px] bg-slate-900/80 border border-slate-800 rounded-xl p-3 overflow-auto max-h-[60vh]">
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(node, null, 2)}
        </pre>
      </div>
    </div>
  );
}