"use client";

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  image: string;
}

export default function PropertyCard({ title, location, price, image }: PropertyCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-proper-black border border-proper-moss shadow-lg hover:scale-[1.02] transition">
      <img src={image} alt={title} className="w-full h-52 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-proper-gold mb-2">{title}</h3>
        <p className="text-sm text-proper-teal mb-1">{location}</p>
        <p className="text-lg text-proper-orange font-bold">{price}</p>
      </div>
    </div>
  );
}
