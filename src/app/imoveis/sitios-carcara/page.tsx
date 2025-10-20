
import { supabase } from '@/lib/supabaseClient';

export default async function Page({ params }) {
  const id = params.slug || null;
  let item = null;
  if (id) {
    const { data } = await supabase.from('anuncios').select('*').eq('id', id).single();
    item = data;
  }
  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      {item ? (
        <div>
          <h1>{item.titulo}</h1>
          <p>{item.descricao}</p>
          <p>Preço: R$ {item.preco}</p>
        </div>
      ) : <p>Anúncio não encontrado</p>}
    </main>
  )
}
