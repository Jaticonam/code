import TopBar from "../components/home/TopBar";
import HomeHeader from "../components/home/HomeHeader";
import HeroSlider from "../components/home/HeroSlider";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProductsSection from "../components/home/FeaturedProductsSection";
import HowToBuySection from "../components/home/HowToBuySection";
import BenefitsSection from "../components/home/BenefitsSection";
import StatsSection from "../components/home/StatsSection";
import ShippingSection from "../components/home/ShippingSection";
import VipSection from "../components/home/VipSection";
import BrandStorySection from "../components/home/BrandStorySection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import FinalCTASection from "../components/home/FinalCTASection";
import HomeFooter from "../components/home/HomeFooter";
import SocialSection from "../components/home/SocialSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <TopBar />
      <HomeHeader />
      <HeroSlider />
      <CategoriesSection />
      <FeaturedProductsSection />
      <HowToBuySection />
      <BenefitsSection />
      <StatsSection />
      <ShippingSection />
      <VipSection />
      <BrandStorySection />
      <TestimonialsSection />
      <FinalCTASection />
      <SocialSection />
      <HomeFooter />
    </div>
  );
}