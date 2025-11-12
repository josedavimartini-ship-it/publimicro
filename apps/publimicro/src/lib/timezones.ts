// Minimal timezone map used by the home page to compute server-side snapshot times.
// Keys are short timezone identifiers used across the app. Offsets are hours relative to UTC.
export type BrazilTimezoneKey = 'FNT' | 'BRST' | 'BRT' | 'AMT' | 'ACT'

export const BRAZIL_TIMEZONES: Record<BrazilTimezoneKey, { offset: number; name: string }> = {
  // Fernando de Noronha (UTC-2)
  FNT: { offset: -2, name: 'Fernando de Noronha' },
  // Brasília Summer Time (historical DST - UTC-2). Kept for compatibility with older data.
  BRST: { offset: -2, name: 'Brasília Summer Time' },
  // Brasília Time (most of SE, S, Central regions) - UTC-3
  BRT: { offset: -3, name: 'Brasília Time' },
  // Amazon Time (western states like AM) - UTC-4
  AMT: { offset: -4, name: 'Amazon Time' },
  // Acre Time - UTC-5
  ACT: { offset: -5, name: 'Acre Time' },
}

// Fallback export for unknown keys — callers can still guard with optional chaining.
export default BRAZIL_TIMEZONES;
