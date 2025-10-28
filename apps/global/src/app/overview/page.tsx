import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliGlobal · Executive Overview',
  description: 'Executive overview covering positioning, audience, and near‑term KPIs.',
  keywords: ['international', 'cross-border', 'expansion', 'localization']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">PubliGlobal — Executive Overview</h1>
      <p className="text-zinc-600 mt-2">Executive overview covering positioning, audience, and near‑term KPIs.</p>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-medium">Highlights</h2>
          <ul className="list-disc pl-6">
            <li>Curated research and current data will appear here.</li>
            <li>We’ll expand with region-specific insights and KPIs.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium">What’s next</h2>
          <p>We’re integrating editorial content, dashboards, and case studies for PubliGlobal.
             If you have priorities, send them our way and we’ll prioritize.</p>
        </div>
      </section>
    </main>
  );
}
