import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    comment:
      "Cà phê Arabica ở đây thực sự tuyệt vời! Hương vị đậm đà, thơm ngon. Tôi đã giới thiệu cho nhiều bạn bè và họ đều rất hài lòng.",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    location: "Hà Nội",
    rating: 5,
    comment:
      "Trà atisô chất lượng cao, uống rất tốt cho sức khỏe. Giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop!",
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    location: "Đà Nẵng",
    rating: 5,
    comment:
      "Dâu tây tươi ngon, ngọt tự nhiên. Con em tôi rất thích. Mứt dâu cũng rất thơm ngon, làm quà tặng rất ý nghĩa.",
  },
]

export function TestimonialSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những phản hồi tích cực từ khách hàng là động lực để chúng tôi không ngừng cải thiện chất lượng
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-muted-foreground italic">"{testimonial.comment}"</blockquote>

                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
