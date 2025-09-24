import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background to-muted py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-balance leading-tight">
                Đặc Sản <span className="text-primary">Lâm Đồng</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                Khám phá hương vị đặc trưng của cao nguyên Lâm Đồng với những sản phẩm chất lượng cao, được chọn lọc kỹ
                càng từ những trang trại địa phương.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="group">
                  Khám phá sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Khách hàng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src="/coffee-plantation-dalat-highlands.jpg"
                alt="Trang trại cà phê Đà Lạt"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl overflow-hidden border-4 border-background shadow-lg">
              <img
                src="/fresh-strawberries-dalat-vietnam.jpg"
                alt="Dâu tây tươi Đà Lạt"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-xl overflow-hidden border-4 border-background shadow-lg">
              <img
                src="/vietnamese-artichoke-tea-dalat.jpg"
                alt="Trà atisô Đà Lạt"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
