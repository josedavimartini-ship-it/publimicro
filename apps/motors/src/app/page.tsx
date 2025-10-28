import { Navbar, Hero, Footer } from "@publimicro/ui";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero
        title="Publimotors — veículos, embarcações e máquinas"
        subtitle="Compre, venda e encontre o veículo ideal com transparência e praticidade."
        ctaText="Explorar anúncios"
        ctaLink="/motors/anuncios"
      />
      <main className="max-w-6xl mx-auto px-6 py-12 text-gray-700 leading-relaxed">
        <p>
          <strong>Publimotors</strong> é o espaço da Publimicro para veículos, maquinário e embarcações — com históricos, galerias e filtros avançados.
        </p>
      </main>
      <Footer />
    </>
  );
}
