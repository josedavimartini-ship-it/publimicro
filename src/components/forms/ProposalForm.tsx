'use client';

import { useState } from 'react';

type ProposalFormProps = {
  propId?: string | null;
};

export default function ProposalForm({
  propId,
}: ProposalFormProps): JSX.Element {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [valor, setValor] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Proposta enviada:', {
      nome,
      email,
      telefone,
      valor,
      mensagem,
      propId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-md bg-white shadow-sm space-y-4"
    >
      <h2 className="text-xl font-semibold">Enviar Proposta</h2>

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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor da Proposta
        </label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mensagem
        </label>
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={4}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition"
      >
        Enviar Proposta
      </button>
    </form>
  );
}
