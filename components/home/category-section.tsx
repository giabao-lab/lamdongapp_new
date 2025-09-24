import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: "coffee",
    name: "Cà phê",
    description: "Cà phê Arabica & Robusta chất lượng cao",
    image: "/vietnamese-arabica-coffee-beans-dalat.jpg",
    productCount: 15,
  },
  {
    id: "tea",
    name: "Trà atisô",
    description: "Trà thảo dược tự nhiên từ hoa atisô",
    image: "/vietnamese-artichoke-tea-dalat.jpg",
    productCount: 8,
  },
  {
    id: "wine",
    name: "Rượu vang",
    description: "Rượu vang đỏ cao cấp từ nho Đà Lạt",
    image: "/vietnamese-red-wine-dalat-bottle.jpg",
    productCount: 12,
  },
  {
    id: "fruits",
    name: "Trái cây",
    description: "Dâu tây, nho và các loại trái cây tươi",
    image: "/fresh-strawberries-dalat-vietnam.jpg",
    productCount: 20,
  },
  {
    id: "preserves",
    name: "Mứt & Bánh kẹo",
    description: "Mứt trái cây và bánh kẹo thủ công",
    image: "/strawberry-jam-vietnamese-traditional.jpg",
    productCount: 25,
  },
]

export function CategorySection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Danh mục sản phẩm</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá các danh mục đặc sản phong phú từ Lâm Đồng
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>

                  <div className="p-4 text-center space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                    <div className="text-xs text-primary font-medium">{category.productCount} sản phẩm</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
