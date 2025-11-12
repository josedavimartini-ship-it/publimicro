import { Suspense } from 'react';
import ClientAssinaturaSucesso from './ClientAssinaturaSucesso';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <ClientAssinaturaSucesso />
    </Suspense>
  );
}
