export function formatBRL(value: number | string | null | undefined): string {
  if (value == null) return '';
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
