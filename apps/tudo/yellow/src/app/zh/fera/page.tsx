import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliYellow · Fera',
  description: 'Fera: espaço criativo para experimentos, drops e protótipos.',
  keywords: ['yellow','fera','creative','labs','drops','zh']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <h1 className="text-3xl font-semibold">PubliYellow — Fera</h1>
      <p className="text-zinc-600 mt-2">Exploramos formatos ousados, colabs e lançamentos experimentais.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">Drop #001</h3>
          <p className="mt-2 text-zinc-600">Peça limitada + storytelling + mecânica de comunidade.</p>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">Collab Criadores</h3>
          <p className="mt-2 text-zinc-600">Cocriação com creators locais e ativações ao vivo.</p>
        </article>
      </div>
    </main>
  );
}
