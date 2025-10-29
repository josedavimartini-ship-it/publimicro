import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fazer Lance — PubliMicro",
  description: "Sistema de lances para propriedades em leilão",
};

export default function BiddingPage({
  searchParams,
}: {
  searchParams: { sitio?: string };
}) {
  const sitioId = searchParams.sitio || "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-[#676767] hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2"
          >
            ← Voltar
          </Link>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] mb-6">
            Sistema de Lances
          </h1>

          <div className="mb-8 p-6 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-xl">
            <h2 className="text-xl font-bold text-[#FF6B35] mb-3">Como Funciona</h2>
            <ol className="space-y-2 text-[#D4A574] text-sm">
              <li>1️⃣ Faça login ou cadastre-se</li>
              <li>2️⃣ Envie sua proposta de lance</li>
              <li>3️⃣ Aguarde aprovação para visita presencial ou virtual</li>
              <li>4️⃣ Após visita aprovada, seu lance será formalizado</li>
              <li>5️⃣ Acompanhe o status em tempo real</li>
            </ol>
          </div>

          {sitioId && (
            <div className="mb-6 p-4 bg-[#0D7377]/10 border border-[#0D7377] rounded-lg">
              <p className="text-sm text-[#0D7377]">
                Propriedade selecionada: <strong className="text-[#D4A574]">{sitioId.toUpperCase()}</strong>
              </p>
            </div>
          )}

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#B7791F] mb-2">
                Valor do Lance (R$)
              </label>
              <input
                type="number"
                placeholder="Ex: 1.050.000"
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#3a3a2a] rounded-lg text-[#D4A574] placeholder-[#676767] focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#B7791F] mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#3a3a2a] rounded-lg text-[#D4A574] focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#B7791F] mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#3a3a2a] rounded-lg text-[#D4A574] focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#B7791F] mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                required
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#3a3a2a] rounded-lg text-[#D4A574] placeholder-[#676767] focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#B7791F] mb-2">
                Mensagem (opcional)
              </label>
              <textarea
                rows={4}
                placeholder="Conte-nos mais sobre seu interesse..."
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#3a3a2a] rounded-lg text-[#D4A574] placeholder-[#676767] focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-lg transition-all hover:scale-105 shadow-xl"
              >
                💰 Enviar Lance
              </button>
              <Link
                href="/"
                className="px-6 py-4 border-2 border-[#676767] text-[#676767] hover:border-[#B7791F] hover:text-[#B7791F] font-bold rounded-lg transition-all text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>

          <div className="mt-8 p-6 bg-[#0D7377]/10 border border-[#0D7377]/30 rounded-xl">
            <h3 className="text-lg font-bold text-[#0D7377] mb-3">Outras Formas de Contato</h3>
            <div className="space-y-2 text-sm text-[#D4A574]">
              <p>📞 <strong>Telefone:</strong> (34) 99261-0004</p>
              <p>📧 <strong>E-mail:</strong> contato@publimicro.com.br</p>
              <p>💬 <strong>WhatsApp:</strong> Clique no ícone flutuante</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}