import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import Link from 'next/link';
import philoseed from '../../data/philoseed.json';
import type { GraphData, GraphNode, GraphLink } from '../../types/graph';

const graphData = philoseed as GraphData;

interface NodePageProps {
  node: GraphNode;
  neighbors: GraphNode[];
  links: GraphLink[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths =
    graphData.nodes?.map((n) => ({
      params: { id: String(n.id) },
    })) ?? [];

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<NodePageProps> = async (context) => {
  const idParam = context.params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) return { notFound: true };

  const node = graphData.nodes.find((n) => String(n.id) === id);
  if (!node) return { notFound: true };

  const links = graphData.links.filter(
    (l) => String(l.source) === id || String(l.target) === id
  );

  const neighborIds = new Set<string>();
  links.forEach((l) => {
    const s = String(l.source);
    const t = String(l.target);
    if (s !== id) neighborIds.add(s);
    if (t !== id) neighborIds.add(t);
  });

  const neighbors = graphData.nodes.filter((n) =>
    neighborIds.has(String(n.id))
  );

  return {
    props: {
      node,
      neighbors,
      links,
    },
  };
};

export default function NodePage({
  node,
  neighbors,
  links,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // strip force-graph internals from metadata
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
    <div className="min-h-screen bg-black text-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <Link
              href="/graph"
              className="text-xs uppercase tracking-wide text-slate-400 hover:text-slate-100"
            >
              ← Back to graph
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            {type && (
              <p className="mt-1 text-sm uppercase tracking-wide text-slate-400">
                {type}
              </p>
            )}
          </div>
        </header>

        {/* primary node card */}
        <section>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/40">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-slate-100">
                  Node details
                </h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-32 text-slate-400">id</dt>
                    <dd className="flex-1 text-slate-100">
                      {String(node.id)}
                    </dd>
                  </div>

                  {Object.entries(meta)
                    .filter(([key]) => !['label', 'title', 'name', 'type', 'kind'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <dt className="w-32 text-slate-400">{key}</dt>
                        <dd className="flex-1 text-slate-100">
                          {typeof value === 'string' || typeof value === 'number'
                            ? String(value)
                            : JSON.stringify(value)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>

              {/* quick summary card section stub (extend later if you add descriptions) */}
              <div className="w-full md:w-64 bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
                <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">
                  Summary
                </div>
                <p>
                  This card is generated from the node&apos;s metadata in the
                  graph dataset. Extend the dataset with fields like
                  <code className="mx-1 text-[10px] bg-slate-900 px-1 py-0.5 rounded">
                    description
                  </code>
                  or
                  <code className="mx-1 text-[10px] bg-slate-900 px-1 py-0.5 rounded">
                    source
                  </code>
                  to enrich this view.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* neighbor cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-slate-100">
            Connected nodes
          </h2>
          {neighbors.length === 0 ? (
            <p className="text-sm text-slate-400">
              No neighbors in this dataset.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {neighbors.map((n) => {
                const nMeta: Record<string, unknown> = { ...n };
                delete nMeta.id;
                delete nMeta.x;
                delete nMeta.y;
                delete nMeta.vx;
                delete nMeta.vy;
                delete nMeta.fx;
                delete nMeta.fy;

                const nTitle =
                  (nMeta.label as string) ??
                  (nMeta.title as string) ??
                  (nMeta.name as string) ??
                  String(n.id);

                const nType =
                  (nMeta.type as string) ??
                  (nMeta.kind as string) ??
                  undefined;

                return (
                  <Link
                    key={String(n.id)}
                    href={`/node/${encodeURIComponent(String(n.id))}`}
                    className="group block bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-sky-500/70 hover:bg-slate-900/90 transition-colors"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-50 group-hover:text-sky-100">
                          {nTitle}
                        </h3>
                        {nType && (
                          <span className="inline-flex items-center rounded-full bg-slate-950/70 border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                            {nType}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-3">
                        {/* crude “preview”: prefer a dedicated description field later */}
                        {typeof nMeta.description === 'string'
                          ? nMeta.description
                          : `Connected to ${title}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* debug / raw links card */}
        <section>
          <details className="bg-slate-950/80 border border-slate-900 rounded-2xl">
            <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-200">
              Debug: raw links ({links.length})
            </summary>
            <div className="px-4 pb-4 pt-2">
              <pre className="text-xs bg-slate-900/80 p-4 rounded-xl overflow-x-auto text-slate-200">
                {JSON.stringify(links, null, 2)}
              </pre>
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}