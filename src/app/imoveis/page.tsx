import { supabase } from '@/lib/supabaseClient'

export default async function Page() {
  const { data } = await supabase.from('items').select('*').eq('status','aprovado').order('created_at',{ascending:false}).limit(50)
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Imóveis (Publiproper)</h1>
      <p className="mb-6">Listagem completa de imóveis. Em desenvolvimento: filtros avançados, mapas e favoritos.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((it:any)=> (
          <a key={it.id} href={`/imoveis/${it.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden">
            <div className="h-44 bg-gray-100 w-full flex items-center justify-center text-sm text-gray-400">Imagem (placeholder)</div>
            <div className="p-4">
              <h3 className="font-semibold">{it.titulo}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{it.descricao}</p>
              <p className="mt-2 font-bold text-emerald-800">R$ {it.preco?.toLocaleString('pt-BR')}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
