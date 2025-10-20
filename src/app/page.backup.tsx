import Hero from "@/components/home/Hero"
import FeaturedProperties from "@/components/home/FeaturedProperties"
import CategoryGrid from "@/components/home/CategoryGrid"
import CallToAction from "@/components/home/CallToAction"
import Footer from "@/components/home/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-blue-100 text-gray-900">
      <Hero />
      <FeaturedProperties />
      <CategoryGrid />
      <CallToAction />
      <Footer />
    </main>
  )
}
