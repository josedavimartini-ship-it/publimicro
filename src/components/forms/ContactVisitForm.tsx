'use client';

import { useState, useEffect } from 'react';

type ContactVisitFormProps = {
  propId?: string | null;
};

export default function ContactVisitForm({
  propId,
}: ContactVisitFormProps): JSX.Element {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (propId) {
      console.log('Formulário carregado para o imóvel:', propId);
    }
  }, [propId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Dados enviados:', { nome, email, telefone, propId });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-md bg-white shadow-sm space-y-4"
    >
      <h2 className="text-xl font-semibold">Agendar Visita</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition"
      >
        Enviar
      </button>
    </form>
  );
}
