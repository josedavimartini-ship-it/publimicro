import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import PropertyDetails from '@/components/listings/PropertyDetails';
import ContactForm from '@/components/listings/ContactForm';

export default async function Page({ params }) {
  const id = params.id;
  let item = null;

  try {
    const { data } = await supabase.from('items').select('*').eq('id', id).single();
    item = data || null;
  } catch (err) {
    item = null;
  }

  if (!item) {
    return (
      <main className="py-16 text-center text-gray-500">
        <h1 className="text-2xl font-semibold mb-2">Anúncio não encontrado</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <PropertyDetails item={item} />

        <div className="flex gap-4">
          <Link href={`/contato?propId=${item.id}`}>
            <button className="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800 transition">
              Contato / Agendar Visita
            </button>
          </Link>

          <Link href={`/proposta?propId=${item.id}`}>
            <button className="bg-emerald-950 text-yellow-400 px-5 py-3 rounded-lg hover:bg-emerald-900 transition">
              Fazer Proposta (sob autorização)
            </button>
          </Link>
        </div>

        <div className="mt-12">
          <ContactForm itemTitle={item.titulo} />
        </div>
      </div>
    </main>
  );
}
