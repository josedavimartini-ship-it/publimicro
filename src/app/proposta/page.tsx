
import ProposalForm from '@/components/forms/ProposalForm';

export default function Page({ searchParams }) {
  const propId = searchParams?.propId || null;
  return (
    <main style={{ padding: 32, maxWidth:900, margin: '0 auto' }}>
      <h1>Formulário de Proposta de Aquisição</h1>
      <p>Envie sua proposta somente após autorização (agendamento e contato). Para enviar uma proposta associada a um imóvel, abra esta página a partir do botão 'Fazer Proposta' no anúncio.</p>
      <ProposalForm propId={propId} />
    </main>
  )
}
