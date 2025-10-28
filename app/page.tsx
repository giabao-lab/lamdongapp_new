import { MainLayout } from "@/components/layout/main-layout"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import dynamic from "next/dynamic"
import { Loading } from "@/components/ui/loading"

// Lazy load non-critical components to improve initial page load
const CategorySection = dynamic(() => import("@/components/home/category-section").then(mod => ({ default: mod.CategorySection })), {
  loading: () => <Loading size="md" className="my-8" />,
  ssr: false, // Disable SSR for these components to speed up initial load
})

const AboutSection = dynamic(() => import("@/components/home/about-section").then(mod => ({ default: mod.AboutSection })), {
  loading: () => <Loading size="md" className="my-8" />,
  ssr: false,
})

const TestimonialSection = dynamic(() => import("@/components/home/testimonial-section").then(mod => ({ default: mod.TestimonialSection })), {
  loading: () => <Loading size="md" className="my-8" />,
  ssr: false,
})

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
