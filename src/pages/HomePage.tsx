import { useEffect, useState } from "react";

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

import { FloatingButtons } from "@/components/FloatingButtons";
import { CartItem } from "@/types/product";

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = () => {
    const storedCart = localStorage.getItem("wooly_cart");

    if (!storedCart) {
      setCart([]);
      return;
    }

    try {
      setCart(JSON.parse(storedCart));
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleStorage = () => {
      loadCart();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", loadCart);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", loadCart);
    };
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const handleCartClick = () => {
    window.location.href = "/catalogo";
  };

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

      <FloatingButtons
        cartCount={cartCount}
        onCartClick={handleCartClick}
        variant="home"
      />
    </div>
  );
}