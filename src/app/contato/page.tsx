export default function ContatoPage() {
  return (
    <main className="relative min-h-screen">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/sitioCanarioFogueira.jpg"
          alt="Fundo contato"
          className="object-cover w-full h-full brightness-75"
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
            <input type="text" placeholder="Nome completo" className="p-3 rounded text-black" />
            <input type="email" placeholder="Email" className="p-3 rounded text-black" />
            <input type="text" placeholder="Telefone/WhatsApp" className="p-3 rounded text-black" />
            <textarea placeholder="Mensagem" rows={4} className="p-3 rounded text-black" />
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
