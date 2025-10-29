'use client';

const worldRegions = [
  {
    continent: 'ðŸŒŽ The Americas',
    regions: [
      {
        name: 'Latin America',
        countries: [
          {
            name: 'ðŸ‡§ðŸ‡· Brazil',
            states: [
              { name: 'SÃ£o Paulo', cities: ['SÃ£o Paulo', 'Campinas', 'Santos'] },
              { name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'NiterÃ³i'] },
              { name: 'Minas Gerais', cities: ['Belo Horizonte', 'UberlÃ¢ndia'] },
            ],
          },
        ],
      },
    ],
  },
];

export default function WorldRegionsSidebar() {
  return (
<aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-[#0c0c0f]/95 backdrop-blur-md border-r-2 border-[#2a2a1a] p-5 overflow-y-auto z-40 shadow-2xl">      {/* Language Dropdown */}
            <select
        className="w-full mb-6 px-4 py-3 bg-[#1a1a1a] border-2 border-[#3a3a2a] text-[#f2e6b1] rounded-lg focus:border-[#00e6cc] focus:outline-none transition-all"
        defaultValue="pt-BR" onChange={(e) => alert(`Troca de idioma para ${e.target.value} - Em breve!`)}
        onChange={(e) => alert(`Troca de idioma para ${e.target.value} - Em breve!`)}
   
   >
        <option value="en">ðŸ‡¬ðŸ‡§ English</option>
        <option value="es">ðŸ‡ªðŸ‡¸ EspaÃ±ol</option>
        <option value="zh">ðŸ‡¨ðŸ‡³ ä¸­æ–‡</option>
        <option value="hi">ðŸ‡®ðŸ‡³ à¤¹à¤¿à¤¨à¥à¤¦à¥€</option>
        <option value="ar">ðŸ‡¸ðŸ‡¦ Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</option>
        <option value="fr">ðŸ‡«ðŸ‡· FranÃ§ais</option>
        <option value="pt-BR">ðŸ‡§ðŸ‡· PortuguÃªs</option>
      </select>

      <h3 className="font-bold text-[#B7791F] mb-4 text-lg">ðŸŒ World Regions</h3>
      <div className="space-y-3 text-sm">
        {worldRegions.map((continent, idx) => (
          <details key={idx} className="group" open>
            <summary className="cursor-pointer text-[#d8c68e] font-semibold hover:text-[#FF6B35] transition-colors list-none flex items-center gap-2">
              <span className="text-xs">â–¸</span>
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
                                      â€¢ {city}
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
