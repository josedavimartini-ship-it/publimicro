import Link from 'next/link'

export default function SectionCard({title, description, href}:{title:string, description:string, href:string}){
  return (
    <Link href={href} className="block rounded-lg shadow bg-white p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </Link>
  )
}
