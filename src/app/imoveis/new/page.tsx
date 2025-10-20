
'use client';
import { useState } from 'react';

export default function NewListing() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { titulo, descricao, preco: Number(preco), localizacao: 'Goiás', imagens: [] };
    const res = await fetch('/api/anuncios', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (res.ok) {
      alert('Anúncio criado: ' + data.data.id);
      window.location.href = '/admin';
    } else {
      alert('Erro: ' + data.error);
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <h1>Novo Anúncio</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input placeholder='Título' value={titulo} onChange={e=>setTitulo(e.target.value)} />
        <textarea placeholder='Descrição' value={descricao} onChange={e=>setDescricao(e.target.value)} />
        <input placeholder='Preço (R$)' value={preco} onChange={e=>setPreco(e.target.value)} />
        <button style={{ background: '#2E7D32', color: '#fff', padding: '8px 12px', borderRadius: 6 }}>Publicar</button>
      </form>
    </main>
  )
}
