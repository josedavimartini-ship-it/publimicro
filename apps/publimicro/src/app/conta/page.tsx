"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContaPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setUser(data.user);
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setUser(data.user);
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-amber-400 mb-2">Conta</h1>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <button onClick={handleSignUp} className="px-4 py-2 bg-green-500 text-white rounded">Registrar</button>
        <button onClick={handleSignIn} className="px-4 py-2 bg-blue-500 text-white rounded">Entrar</button>
        {error && <div className="text-red-500">{error}</div>}
        {user && <div className="text-green-500">Bem-vindo, {user.email}!</div>}
      </div>
    </main>
  );
}