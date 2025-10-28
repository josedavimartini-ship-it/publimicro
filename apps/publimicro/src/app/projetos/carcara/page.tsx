import Image from "next/image";
import Link from "next/link";

const carcaraRanches = [
  {
    id: "canario",
    name: "Sítio Canário",
    area: "12.5 hectares",
    price: "R$ 850.000",
    status: "Disponível",
    features: ["Casa sede", "Acesso ao rio", "Energia elétrica", "Área para cultivo"],
    image: "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/canario.jpg",
  },
  {
    id: "mutum",
    name: "Sítio Mutum",
    area: "15 hectares",
    price: "R$ 950.000",
    status: "Disponível",
    features: ["Vista privilegiada", "Nascente de água", "Mata nativa preservada", "Infraestrutura básica"],
    image: "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mutum.jpg",
  },
  {
    id: "acerola",
    name: "Sítio Acerola",
    area: "10 hectares",
    price: "R$ 750.000",
    status: "Disponível",
    features: ["Área plana", "Solo fértil", "Próximo à rodovia", "Pomar existente"],
    image: "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/acerola.jpg",
  },
  {
    id: "sabia",
    name: "Sítio Sabiá",
    area: "13 hectares",
    price: "R$ 880.000",
    status: "Disponível",
    features: ["Ribeirinho", "Área de lazer", "Infraestrutura completa", "Árvores frutíferas"],
    image: "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol1.jpg",
  },
  {
    id: "bem-te-vi",
    name: "Sítio Bem-te-vi",
    area: "14 hectares",
    price: "R$ 920.000",
    status: "Disponível",
    features: ["Vista panorâmica", "Topografia favorável", "Água abundante", "Potencial turístico"],
    image: "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosolOrange.jpg",
  },
  {
    id: "tangara",
    name: "Sítio Tangará",
    area: "16 hectares",
    price: "R$ 1.050.000",
    status: "Disponível",
    features: ["Maior área", "Casa com 3 quartos", "Curral e estábulo", "Área agrícola produtiva"],
    image: "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/lindosoljaposto.jpg",
  },
];

const whatsappNumber = "5562999999999"; // Replace with your real WhatsApp number

export default function CarcaraPage(): JSX.Element {
  return (
    <main className="relative min-h-screen flex flex-col bg-[#0f0f0f]">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
            alt="Sítios Carcará"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-[#0f0f0f]/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-amber-500/20 border border-amber-500/40 rounded-full backdrop-blur-md">
            <span className="text-2xl">🌾</span>
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase">
              Projeto Ecológico Exclusivo
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
            Sítios Carcará
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-[#bfa97a] leading-relaxed mb-8 drop-shadow-lg">
            Um projeto ecológico e exclusivo às margens do rio, com <strong className="text-amber-400">6 sítios à venda</strong>,
            cada um com vocação natural para descanso, agrofloresta e turismo sustentável.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#unidades"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-lg font-bold rounded-xl transition-all hover:scale-105 shadow-2xl"
            >
              Ver 6 Unidades Disponíveis
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Olá! Tenho interesse no projeto Sítios Carcará.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg font-bold rounded-xl transition-all hover:scale-105 shadow-2xl flex items-center gap-3"
            >
              <span className="text-2xl">💬</span>
              Contato via WhatsApp
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-amber-500/50 rounded-full mx-auto flex justify-center">
              <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0f0f0f] to-[#0b0b0b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#cfa847] mb-4">
              O Projeto Sítios Carcará
            </h2>
            <p className="text-[#bfa97a] max-w-3xl mx-auto text-lg">
              Uma oportunidade única de investimento em propriedades sustentáveis, 
              integradas à natureza e com potencial para múltiplos usos.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "🌳",
                title: "Sustentabilidade",
                description: "Projeto de reflorestamento e conservação ambiental integrado"
              },
              {
                icon: "🏞️",
                title: "Localização Privilegiada",
                description: "Às margens do rio, com acesso facilitado e infraestrutura"
              },
              {
                icon: "💰",
                title: "Valorização",
                description: "Investimento com alto potencial de valorização a médio prazo"
              },
              {
                icon: "🏡",
                title: "Uso Múltiplo",
                description: "Lazer, moradia, agricultura ou turismo sustentável"
              },
              {
                icon: "⚡",
                title: "Infraestrutura",
                description: "Energia elétrica, água abundante e acesso por estrada"
              },
              {
                icon: "🎯",
                title: "Documentação",
                description: "Toda documentação regularizada e pronta para transferência"
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#0b0b0b] border border-[#242424] rounded-xl hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#e6c86b] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#bfa97a]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-20 px-6 bg-[#0b0b0b]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#cfa847]">
            Galeria — Conheça o Projeto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "acerola.jpg",
              "canario.jpg",
              "lindosoljaposto.jpg",
              "mutum.jpg",
              "pordosol1.jpg",
              "pordosolOrange.jpg",
            ].map((file) => (
              <div key={file} className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src={`https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/${file}`}
                  alt={`Imagem ${file.replace(".jpg", "")}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Units Section */}
      <section id="unidades" className="py-20 px-6 bg-gradient-to-b from-[#0b0b0b] to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#cfa847] mb-4">
              6 Unidades Disponíveis
            </h2>
            <p className="text-[#bfa97a] max-w-2xl mx-auto">
              Cada sítio possui características únicas. Escolha o que melhor se adapta aos seus objetivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {carcaraRanches.map((ranch) => (
              <article
                key={ranch.id}
                className="group bg-gradient-to-b from-[#0b0b0b] to-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2"
              >
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-green-500 text-black text-xs font-bold rounded-full shadow-lg">
                  {ranch.status}
                </div>

                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={ranch.image}
                    alt={ranch.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#e6c86b] mb-2 group-hover:text-amber-500 transition-colors">
                    {ranch.name}
                  </h3>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#242424]">
                    <div>
                      <div className="text-xs text-[#bfa97a]">Área</div>
                      <div className="text-lg font-bold text-amber-500">{ranch.area}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#bfa97a]">Preço</div>
                      <div className="text-xl font-bold text-[#cfa847]">{ranch.price}</div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {ranch.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-[#bfa97a] flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="space-y-2">
                    <Link
                      href={`/imoveis/sitios-carcara/${ranch.id}`}
                      className="block text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-sm font-bold rounded-lg transition-all hover:scale-[1.02] shadow-lg"
                    >
                      Ver Detalhes + Tour 3D
                    </Link>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=Olá! Tenho interesse no ${ranch.name}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center px-4 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-bold rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">💬</span>
                      Agendar Visita
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[#0f0f0f] via-amber-500/5 to-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl mb-6">🏡</div>
          <h2 className="text-4xl font-bold text-[#cfa847] mb-4">
            Pronto para Conhecer Pessoalmente?
          </h2>
          <p className="text-[#bfa97a] mb-8 text-lg">
            Agende uma visita presencial ou por videoconferência. 
            Nossa equipe está pronta para apresentar cada detalhe do projeto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule-visit?project=sitios-carcara"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-105"
            >
              📅 Agendar Visita
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">💬</span>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#242424] bg-[#0b0b0b] px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="text-[#cfa847] hover:text-amber-500 transition-colors">
            ← Voltar para Publimicro
          </Link>
          <p className="text-sm text-[#bfa97a] mt-4">
            © 2025 Publimicro — Sítios Carcará. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
