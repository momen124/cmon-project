import { CategorySection } from "./components/Home/CategorySection";
import { FeaturedSections } from "./components/Home/FeaturedSections";
import { Hero } from "./components/Home/hero";
import ClientLayout from "./components/Layout/ClientLayout";

export default function HomePage() {
  return (
    <main>
      <ClientLayout> 
      <Hero />
      <CategorySection />
      <FeaturedSections />
       </ClientLayout>
      {/* Add any additional components or sections here */}
    </main>
  );
}
