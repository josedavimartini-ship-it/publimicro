import ProposalForm from '@/components/forms/ProposalForm';

type SearchParams = {
  propId?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<JSX.Element> {
  const resolved = await searchParams;
  const propId = resolved?.propId ?? null;

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1>Formulário de Proposta de Aquisição</h1>
      <p>
        Envie sua proposta somente após autorização (agendamento e contato). Para enviar uma proposta
        associada a um imóvel, abra esta página a partir do botão <strong>“Fazer Proposta”</strong> no anúncio.
      </p>
      <ProposalForm propId={propId} />
    </main>
  );
}
