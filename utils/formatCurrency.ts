export function formatBRL(value:any){
  if(value==null) return ''
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
