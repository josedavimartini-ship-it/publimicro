'use client';

const worldRegions = [
  {
    continent: '🌎 The Americas',
    regions: [
      {
        name: 'Latin America',
        countries: [
          {
            name: '🇧🇷 Brazil',
            states: [
              { name: 'São Paulo', cities: ['São Paulo', 'Campinas', 'Santos'] },
              { name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'Niterói'] },
              { name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia'] },
            ],
          },
        ],
      },
    ],
  },
];

export default function WorldRegionsSidebar() {
  return (
    <aside className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-64 bg-[#0c0c0f]/95 backdrop-blur-md border-l-2 border-[#2a2a1a] p-5 overflow-y-auto z-40 shadow-2xl">
      {/* Language Dropdown */}
      <select
        className="w-full mb-6 px-4 py-3 bg-[#1a1a1a] border-2 border-[#3a3a2a] text-[#f2e6b1] rounded-lg focus:border-[#00e6cc] focus:outline-none transition-all"
        defaultValue="pt-BR"
      >
        <option value="en">🇬🇧 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="zh">🇨🇳 中文</option>
        <option value="hi">🇮🇳 हिन्दी</option>
        <option value="ar">🇸🇦 العربية</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="pt-BR">🇧🇷 Português</option>
      </select>

      <h3 className="font-bold text-[#B7791F] mb-4 text-lg">🌍 World Regions</h3>
      <div className="space-y-3 text-sm">
        {worldRegions.map((continent, idx) => (
          <details key={idx} className="group" open>
            <summary className="cursor-pointer text-[#d8c68e] font-semibold hover:text-[#FF6B35] transition-colors list-none flex items-center gap-2">
              <span className="text-xs">▸</span>
              {continent.continent}
            </summary>
            <div className="ml-4 mt-2 space-y-2">
              {continent.regions.map((region, ridx) => (
                <details key={ridx} open>
                  <summary className="cursor-pointer text-[#cfcfcf] hover:text-[#0D7377] transition-colors">
                    {region.name}
                  </summary>
                  <div className="ml-4 mt-2 space-y-1">
                    {region.countries.map((country, cidx) => (
                      <details key={cidx} open>
                        <summary className="cursor-pointer text-[#cfcfcf] hover:text-[#5F7161] transition-colors">
                          {country.name}
                        </summary>
                        <ul className="ml-4 mt-1 space-y-1 text-xs text-[#676767]">
                          {country.states.map((state, sidx) => (
                            <li key={sidx}>
                              <details>
                                <summary className="cursor-pointer hover:text-[#B7791F]">{state.name}</summary>
                                <ul className="ml-3 mt-1 space-y-0.5">
                                  {state.cities.map((city, cyidx) => (
                                    <li key={cyidx} className="hover:text-[#FF6B35] cursor-pointer">
                                      • {city}
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </aside>
  );
}