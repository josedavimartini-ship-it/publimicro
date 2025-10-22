import Image from "next/image";

export default function ContatoPage(): JSX.Element {
  return (
    <main className="relative min-h-screen">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/sitioCanarioFogueira.jpg"
          alt="Fundo contato"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* Conteúdo */}
      <section className="flex flex-col items-center justify-center min-h-screen text-white text-center px-6">
        <div className="bg-black/50 p-10 rounded-xl max-w-xl w-full shadow-xl">
          <h1 className="text-4xl font-bold mb-6">Contato & Agendamento</h1>
          <p className="mb-8 text-lg">
            Solicite informações, agende visitas presenciais ou videoconferências.
          </p>
          <form className="flex flex-col gap-4">
            <label htmlFor="nome" className="sr-only">Nome completo</label>
            <input id="nome" type="text" placeholder="Nome completo" className="p-3 rounded text-black" />

            <label htmlFor="email" className="sr-only">Email</label>
            <input id="email" type="email" placeholder="Email" className="p-3 rounded text-black" />

            <label htmlFor="telefone" className="sr-only">Telefone ou WhatsApp</label>
            <input id="telefone" type="text" placeholder="Telefone/WhatsApp" className="p-3 rounded text-black" />

            <label htmlFor="mensagem" className="sr-only">Mensagem</label>
            <textarea id="mensagem" placeholder="Mensagem" rows={4} className="p-3 rounded text-black" />

            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Enviar solicitação
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
