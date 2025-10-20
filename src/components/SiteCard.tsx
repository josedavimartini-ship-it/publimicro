
import Link from 'next/link';

export default function SiteCard({site}) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <img src={site.imagem || '/images/carcara-1.png'} alt={site.titulo} style={{width:'100%', height:180, objectFit:'cover'}} />
      <div style={{padding:12}}>
        <h3 style={{margin:0}}>{site.titulo}</h3>
        <p style={{margin:'8px 0'}}>{site.categoria} • R$ {site.preco}</p>
        <Link href={`/imoveis/${site.id}`}><button style={{background:'#2E7D32', color:'#fff', padding:'8px 10px', borderRadius:6}}>Ver detalhes</button></Link>
      </div>
    </div>
  )
}
