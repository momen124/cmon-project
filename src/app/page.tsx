import { CategorySection } from "./components/Home/CategorySection";
import { FeaturedSections } from "./components/Home/FeaturedSections";
import { Hero } from "./components/Home/hero";
import TestTailwind from "./components/Home/TestTailwind";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategorySection />
      <FeaturedSections />
      
      {/* Add any additional components or sections here */}
    </main>
  );
}
