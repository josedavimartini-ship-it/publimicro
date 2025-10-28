export default function Page() {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center px-4">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#162017] via-[#111515] to-[#0b0b0b] p-8 sm:p-12 shadow-2xl border border-[#2a2a2a]">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -z-10" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-light)]/3 rounded-full blur-3xl -z-10" aria-hidden="true" />
          
          {/* Content */}
          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
              </span>
              <span className="text-sm font-medium text-[var(--accent)]">Em Desenvolvimento</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--accent-light)] via-[var(--accent)] to-[var(--accent-dark)] bg-clip-text text-transparent">
              Publimicro Journey
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[var(--muted)] mb-8 leading-relaxed">
              Explore experiências únicas e jornadas transformadoras no ecossistema Publimicro. 
              <span className="block mt-2 text-[var(--accent-dark)]">
                Um espaço dedicado à inovação e descoberta.
              </span>
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: "🎯", title: "Conceito", desc: "Ideias inovadoras" },
                { icon: "🚀", title: "Experiências", desc: "Jornadas únicas" },
                { icon: "✨", title: "Futuro", desc: "Em breve mais" },
              ].map((feature) => (
                <div 
                  key={feature.title}
                  className="flex flex-col items-center text-center p-4 rounded-lg bg-[#0f1110]/50 border border-[#2a2a2a] hover:border-[var(--accent)]/30 transition-all"
                >
                  <span className="text-3xl mb-2" aria-hidden="true">{feature.icon}</span>
                  <h3 className="text-sm font-semibold text-[var(--accent-light)] mb-1">{feature.title}</h3>
                  <p className="text-xs text-[var(--muted)]">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/explorar"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-black font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-[var(--accent)]/20"
              >
                Explorar Agora
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <a 
                href="/sobre"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 font-semibold rounded-lg transition-all"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "100+", label: "Conceitos" },
            { value: "50+", label: "Experiências" },
            { value: "24/7", label: "Disponível" },
            { value: "∞", label: "Possibilidades" },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="text-center p-6 rounded-xl bg-[#111515]/50 border border-[#2a2a2a] hover:border-[var(--accent)]/20 transition-all"
            >
              <div className="text-3xl sm:text-4xl font-bold text-[var(--accent)] mb-2">{stat.value}</div>
              <div className="text-sm text-[var(--muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}