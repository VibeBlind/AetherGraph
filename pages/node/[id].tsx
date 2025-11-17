// pages/node/[id].tsx
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import philoseed from '../../data/philoseed.json';

interface GraphNode {
  id: string | number;
  label?: string;
  title?: string;
  type?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  [key: string]: any;
}

interface GraphLink {
  source: string | number;
  target: string | number;
  [key: string]: any;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  [key: string]: any;
}

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
    fallback: false, // change to 'blocking' later if you add dynamic data
  };
};

export const getStaticProps: GetStaticProps<NodePageProps> = async (context) => {
  const idParam = context.params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return { notFound: true };
  }

  const node = graphData.nodes.find((n) => String(n.id) === id);
  if (!node) {
    return { notFound: true };
  }

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
  const meta = { ...node };
  delete meta.id;
  delete meta.x;
  delete meta.y;
  delete meta.vx;
  delete meta.vy;
  delete meta.fx;
  delete meta.fy;

  return (
    <div className="min-h-screen bg-black text-slate-50">
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header>
          <Link href="/graph" className="text-sm text-slate-400 hover:text-slate-200">
            ← Back to graph
          </Link>
          <h1 className="mt-4 text-3xl font-semibold">
            {meta.label ?? meta.title ?? String(node.id)}
          </h1>
          {meta.type && (
            <p className="mt-1 text-sm uppercase tracking-wide text-slate-400">
              {String(meta.type)}
            </p>
          )}
        </header>

        {/* Node metadata */}
        <section>
          <h2 className="text-lg font-medium mb-2">Metadata</h2>
          {Object.keys(meta).length === 0 && (
            <p className="text-sm text-slate-400">No metadata available.</p>
          )}
          {Object.entries(meta).length > 0 && (
            <dl className="space-y-2 text-sm">
              {Object.entries(meta).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <dt className="w-32 text-slate-400">{key}</dt>
                  <dd className="flex-1">
                    {typeof value === 'string' || typeof value === 'number'
                      ? String(value)
                      : JSON.stringify(value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* Neighborhood */}
        <section>
          <h2 className="text-lg font-medium mb-2">Connected nodes</h2>
          {neighbors.length === 0 && (
            <p className="text-sm text-slate-400">No neighbors in this dataset.</p>
          )}
          {neighbors.length > 0 && (
            <ul className="space-y-1 text-sm">
              {neighbors.map((n) => (
                <li key={String(n.id)}>
                  <Link
                    href={`/node/${encodeURIComponent(String(n.id))}`}
                    className="text-sky-300 hover:text-sky-100"
                  >
                    {n.label ?? n.title ?? String(n.id)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Raw links for debugging */}
        <section>
          <h2 className="text-lg font-medium mb-2">Links</h2>
          {links.length === 0 && (
            <p className="text-sm text-slate-400">No links.</p>
          )}
          {links.length > 0 && (
            <pre className="text-xs bg-slate-900/60 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(links, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
}