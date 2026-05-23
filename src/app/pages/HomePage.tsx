import TopBar from "@/modules/home/components/TopBar";
import HomeHeader from "@/modules/home/components/HomeHeader";
import HeroSlider from "@/modules/home/components/HeroSlider";
import TikTokSection from "@/modules/home/components/TikTokSection";
import FeaturedProductsSection from "@/modules/home/components/FeaturedProductsSection";
import CategoriesSection from "@/modules/home/components/CategoriesSection";
import HowToBuySection from "@/modules/home/components/HowToBuySection";
import BenefitsSection from "@/modules/home/components/BenefitsSection";
import StatsSection from "@/modules/home/components/StatsSection";
import ShippingSection from "@/modules/home/components/ShippingSection";
import VipSection from "@/modules/home/components/VipSection";
import BrandStorySection from "@/modules/home/components/BrandStorySection";
import TestimonialsSection from "@/modules/home/components/TestimonialsSection";
import FinalCTASection from "@/modules/home/components/FinalCTASection";
import SocialSection from "@/modules/home/components/SocialSection";
import HomeFooter from "@/modules/home/components/HomeFooter";

import { FloatingButtons } from "@/shared/components/layout/FloatingButtons";
import { useCartStore } from "@/modules/cart/store";

export default function HomePage(){
  const {totalItems}=useCartStore();

  return(
    <div className="min-h-screen overflow-x-hidden bg-background font-sans">
      <TopBar/>
      <HomeHeader/>
      <HeroSlider/>
      <TikTokSection/>
      <FeaturedProductsSection/>
      <CategoriesSection/>
      <HowToBuySection/>
      <BenefitsSection/>
      <StatsSection/>
      <ShippingSection/>
      <VipSection/>
      <BrandStorySection/>
      <TestimonialsSection/>
      <FinalCTASection/>
      <SocialSection/>
      <HomeFooter/>

      <FloatingButtons
        cartCount={totalItems}
        onCartClick={()=>{window.location.href="/catalogo";}}
        variant="home"
      />
    </div>
  );
}