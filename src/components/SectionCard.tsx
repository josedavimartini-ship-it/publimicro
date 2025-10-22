import Link from "next/link";

interface SectionCardProps {
  title: string;
  description: string;
  href: string;
}

export default function SectionCard({
  title,
  description,
  href,
}: SectionCardProps): JSX.Element {
  return (
    <Link
      href={href}
      className="block rounded-lg shadow bg-white p-6 hover:shadow-lg transition"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </Link>
  );
}
