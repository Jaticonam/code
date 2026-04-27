import TopBar from "../components/home/TopBar";
import HomeHeader from "../components/home/HomeHeader";
import HeroSlider from "../components/home/HeroSlider";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProductsSection from "../components/home/FeaturedProductsSection";
import HowToBuySection from "../components/home/HowToBuySection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <TopBar />
      <HomeHeader />
      <HeroSlider />
      <CategoriesSection />
      <FeaturedProductsSection />
      <HowToBuySection />
    </div>
  );
}