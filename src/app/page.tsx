import Hero from "@/components/home/Hero";
import CarcaraHighlights from "@/components/home/CarcaraHighlights";
import CategoryGrid from "@/components/home/CategoryGrid";
import CallToAction from "@/components/home/CallToAction";

export default function Home(): JSX.Element {
  return (
    <main>
      <Hero />
      <CarcaraHighlights />
      <CategoryGrid />
      <CallToAction />
    </main>
  );
}
