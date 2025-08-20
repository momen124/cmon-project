import { CategorySection } from "./components/Home/CategorySection";
import { FeaturedSections } from "./components/Home/FeaturedSections";
import { Hero } from "./components/Home/hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedSections />
      <CategorySection />
    </main>
  );
}
