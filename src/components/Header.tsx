import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <header style={{ background: '#004D40', color: '#FFD700', padding: 12 }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <strong>Publimicro</strong>
        </div>
        <nav style={{ display: 'flex', gap: 10 }}>
          <Link href="/">Início</Link>
          <Link href="/imoveis">Imóveis</Link>
          <Link href="/classificados/imoveis">Classificados</Link>
          <Link href="/contato">Contato</Link>
        </nav>
      </div>
    </header>
  );
}
