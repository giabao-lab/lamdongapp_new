import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary"></div>
              <span className="font-serif text-lg sm:text-xl font-bold text-primary whitespace-nowrap">
                Đặc Sản Lâm Đồng
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mang đến những sản phẩm đặc sản chất lượng cao từ cao nguyên Lâm Đồng, nơi có khí hậu và đất đai lý tưởng
              cho nông sản sạch.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  Chính sách giao hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Danh mục sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=coffee" className="text-muted-foreground hover:text-primary">
                  Cà phê
                </Link>
              </li>
              <li>
                <Link href="/products?category=tea" className="text-muted-foreground hover:text-primary">
                  Trà atisô
                </Link>
              </li>
              <li>
                <Link href="/products?category=wine" className="text-muted-foreground hover:text-primary">
                  Rượu vang
                </Link>
              </li>
              <li>
                <Link href="/products?category=fruits" className="text-muted-foreground hover:text-primary">
                  Trái cây
                </Link>
              </li>
              <li>
                <Link href="/products?category=preserves" className="text-muted-foreground hover:text-primary">
                  Mứt & Bánh kẹo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Thông tin liên hệ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Đà Lạt, Lâm Đồng, Việt Nam</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">info@dacsanlamdong.vn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Đặc Sản Lâm Đồng. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
