import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Award, Truck, Heart } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "100% Tự nhiên",
    description:
      "Tất cả sản phẩm đều được trồng và chế biến theo phương pháp tự nhiên, không sử dụng hóa chất độc hại.",
  },
  {
    icon: Award,
    title: "Chất lượng cao",
    description: "Được chứng nhận chất lượng và an toàn thực phẩm, đảm bảo tiêu chuẩn xuất khẩu.",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Giao hàng toàn quốc trong 2-3 ngày, đóng gói cẩn thận để giữ nguyên chất lượng.",
  },
  {
    icon: Heart,
    title: "Hỗ trợ nông dân",
    description: "Mỗi giao dịch đều góp phần hỗ trợ sinh kế cho các nông dân địa phương tại Lâm Đồng.",
  },
]

export function AboutSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold">Tại sao chọn chúng tôi?</h2>
              <p className="text-lg text-muted-foreground">
                Với hơn 10 năm kinh nghiệm trong việc phát triển và phân phối các sản phẩm đặc sản Lâm Đồng, chúng tôi
                cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/grape-vineyard-dalat-vietnam.jpg"
                alt="Vườn nho Đà Lạt"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-32 rounded-xl overflow-hidden border-4 border-background shadow-lg">
              <img
                src="/artichoke-flowers-field-vietnam.jpg"
                alt="Cánh đồng hoa atisô"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
