import "./globals.css"

export default function Page() {{
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-xl p-8" style={{background:"#111515"}}>
          <h1 className="text-3xl font-bold mb-4">Publimicro — share</h1>
          <p className="text-lg text-[#d6c88b] mb-6">Apresentação e conceito para a seção share</p>
          <a href="/share/anuncios" className="inline-block px-5 py-3 bg-amber-700 rounded-md">Explorar Publimicro — share</a>
        </div>
      </section>
    </>
  )
}}
