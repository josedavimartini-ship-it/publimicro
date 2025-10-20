
'use client';
import { useState } from 'react';

export default function ProposalForm({ propId }) {
  const [nome,setNome]=useState('');
  const [email,setEmail]=useState('');
  const [telefone,setTelefone]=useState('');
  const [cidade,setCidade]=useState('Brasil');
  const [pais,setPais]=useState('Brasil');
  const [valor,setValor]=useState('');
  const [condicoes,setCondicoes]=useState('');
  const [justificativa,setJustificativa]=useState('');
  const [docs,setDocs]=useState(null);

  async function handleSubmit(e){
    e.preventDefault();
    const form = new FormData();
    form.append('nome',nome);
    form.append('email',email);
    form.append('telefone',telefone);
    form.append('cidade',cidade);
    form.append('pais',pais);
    form.append('valor',valor);
    form.append('condicoes',condicoes);
    form.append('justificativa',justificativa);
    form.append('prop_id', propId || '');
    const res = await fetch('/api/proposta', { method: 'POST', body: form });
    const data = await res.json();
    if (res.ok) {
      alert('Proposta enviada com sucesso!');
    } else {
      alert('Erro: ' + data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:10}} encType="multipart/form-data">
      <input required placeholder="Nome completo" value={nome} onChange={e=>setNome(e.target.value)} />
      <input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Telefone/WhatsApp" value={telefone} onChange={e=>setTelefone(e.target.value)} />
      <input placeholder="Cidade" value={cidade} onChange={e=>setCidade(e.target.value)} />
      <input placeholder="País" value={pais} onChange={e=>setPais(e.target.value)} />
      <input required placeholder="Valor da proposta (R$)" value={valor} onChange={e=>setValor(e.target.value)} />
      <textarea placeholder="Condições da proposta" value={condicoes} onChange={e=>setCondicoes(e.target.value)} />
      <textarea placeholder="Justificativa" value={justificativa} onChange={e=>setJustificativa(e.target.value)} />
      <input type="file" name="docs" multiple onChange={e=>setDocs(e.target.files)} />
      <button type="submit" style={{background:'#004D40', color:'#FFD700', padding:'8px 10px', borderRadius:6}}>Enviar proposta</button>
    </form>
  )
}
