import { MainLayout } from "@/components/layout/main-layout"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategorySection } from "@/components/home/category-section"
import { AboutSection } from "@/components/home/about-section"
import { TestimonialSection } from "@/components/home/testimonial-section"

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      <AboutSection />
      <TestimonialSection />
    </MainLayout>
  )
}
