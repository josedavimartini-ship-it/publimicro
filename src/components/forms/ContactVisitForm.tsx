
'use client';
import { useState, useEffect } from 'react';

export default function ContactVisitForm({ propId }) {
  const [nome,setNome]=useState('');
  const [email,setEmail]=useState('');
  const [telefone,setTelefone]=useState('');
  const [cidade,setCidade]=useState('');
  const [pais,setPais]=useState('Brasil');
  const [mensagem,setMensagem]=useState('');
  const [datePref,setDatePref]=useState('');

  useEffect(()=>{
    if (propId) {
      // placeholder for future fetch
    }
  },[propId]);

  async function handleSubmit(e){
    e.preventDefault();
    const payload = { nome, email, telefone, cidade, pais, mensagem, preferencia_date: datePref, prop_id: propId || null };
    const res = await fetch('/api/contato', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if (res.ok) {
      alert('Obrigado — sua solicitação foi enviada!');
    } else {
      alert('Erro: ' + data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:10}}>
      <input required placeholder="Nome completo" value={nome} onChange={e=>setNome(e.target.value)} />
      <input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Telefone/WhatsApp" value={telefone} onChange={e=>setTelefone(e.target.value)} />
      <input placeholder="Cidade" value={cidade} onChange={e=>setCidade(e.target.value)} />
      <input placeholder="País" value={pais} onChange={e=>setPais(e.target.value)} />
      <input type="datetime-local" value={datePref} onChange={e=>setDatePref(e.target.value)} />
      <textarea placeholder="Mensagem" value={mensagem} onChange={e=>setMensagem(e.target.value)} />
      <button type="submit" style={{background:'#1A3C40', color:'#FFD700', padding:'8px 10px', borderRadius:6}}>Enviar solicitação</button>
    </form>
  )
}
