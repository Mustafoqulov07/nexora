import { Hero } from "@/components/home/hero";
import { LiveTicker } from "@/components/home/live-ticker";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustSection } from "@/components/home/trust-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveTicker />
      <CategoryGrid />
      <FeaturedProducts />
      <TrustSection />
    </>
  );
}
