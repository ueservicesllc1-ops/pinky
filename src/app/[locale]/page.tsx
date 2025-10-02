import HeroPopup from "@/components/HeroPopup";
import BannerCarousel from "@/components/BannerCarousel";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CustomizationSection from "@/components/sections/CustomizationSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroPopup />
      <BannerCarousel />
      <FeaturedProducts />
      <CustomizationSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
