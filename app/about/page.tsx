import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Award, Truck, Heart, Users, MapPin, Calendar, Star } from "lucide-react"

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

const stats = [
  { icon: Users, label: "Khách hàng tin tưởng", value: "10,000+" },
  { icon: MapPin, label: "Tỉnh thành phủ sóng", value: "63" },
  { icon: Calendar, label: "Năm kinh nghiệm", value: "15+" },
  { icon: Star, label: "Đánh giá trung bình", value: "4.9/5" },
]

const timeline = [
  {
    year: "2009",
    title: "Thành lập công ty",
    description: "Bắt đầu với việc thu mua và phân phối cà phê Arabica từ các nông dân địa phương.",
  },
  {
    year: "2012",
    title: "Mở rộng sản phẩm",
    description: "Thêm trà atisô, rượu vang và các sản phẩm nông sản khác vào danh mục.",
  },
  {
    year: "2016",
    title: "Chứng nhận chất lượng",
    description: "Đạt được các chứng nhận HACCP, ISO 22000 và chứng nhận hữu cơ.",
  },
  {
    year: "2020",
    title: "Thương mại điện tử",
    description: "Ra mắt nền tảng bán hàng trực tuyến, mở rộng thị trường toàn quốc.",
  },
  {
    year: "2024",
    title: "Phát triển bền vững",
    description: "Triển khai chương trình nông nghiệp bền vững và hỗ trợ cộng đồng nông dân.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="w-fit">
                Về chúng tôi
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold">
                Đặc sản Lâm Đồng
                <span className="text-primary block">Chất lượng từ núi rừng</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Chúng tôi tự hào là đơn vị tiên phong trong việc mang đến những sản phẩm đặc sản chất lượng cao từ vùng
                đất Lâm Đồng xinh đẹp, kết nối trực tiếp từ nông dân đến người tiêu dùng.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="/coffee-plantation-dalat-highlands.jpg"
                  alt="Vườn cà phê Đà Lạt"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Với hơn 15 năm kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm đặc sản chất lượng nhất từ Lâm Đồng.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Hành trình phát triển</h2>
            <p className="text-lg text-muted-foreground">
              Từ những bước đầu khiêm tốn đến thương hiệu uy tín hàng đầu về đặc sản Lâm Đồng
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{item.year}</Badge>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold">Sứ mệnh của chúng tôi</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Chúng tôi tin rằng những sản phẩm tự nhiên, chất lượng cao không chỉ mang lại giá trị dinh dưỡng mà
                  còn kết nối con người với thiên nhiên và văn hóa địa phương.
                </p>
                <p>
                  Sứ mệnh của chúng tôi là bảo tồn và phát triển các giá trị truyền thống của nông nghiệp Lâm Đồng, đồng
                  thời tạo ra những cơ hội việc làm bền vững cho cộng đồng nông dân địa phương.
                </p>
                <p>
                  Mỗi sản phẩm chúng tôi cung cấp đều mang trong mình câu chuyện về con người, về đất đai và về tình yêu
                  với nghề nông của những người nông dân Lâm Đồng.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="/artichoke-flowers-field-vietnam.jpg"
                  alt="Cánh đồng hoa atisô"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-40 h-32 rounded-xl overflow-hidden border-4 border-background shadow-lg">
                <img
                  src="/grape-vineyard-dalat-vietnam.jpg"
                  alt="Vườn nho Đà Lạt"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
