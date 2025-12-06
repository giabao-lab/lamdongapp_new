"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface RevenueData {
  month: string
  revenue: number
  orders: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Nếu có dữ liệu, hiển thị các tháng có doanh thu
  // Nếu ít hơn 3 tháng, thêm các tháng gần nhất để chart đẹp hơn
  let chartData = data
  
  if (data.length > 0 && data.length < 3) {
    // Nếu có ít dữ liệu, thêm các tháng gần nhất
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const monthsAgo = 5 - i
      const date = new Date(currentYear, currentMonth - 1 - monthsAgo, 1)
      return `T${date.getMonth() + 1}/${date.getFullYear()}`
    })
    
    chartData = last6Months.map(month => {
      const existingData = data.find(d => d.month === month)
      return existingData || { month, revenue: 0, orders: 0 }
    })
  } else if (data.length === 0) {
    // Nếu không có dữ liệu, hiển thị 6 tháng gần nhất với giá trị 0
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    chartData = Array.from({ length: 6 }, (_, i) => {
      const monthsAgo = 5 - i
      const date = new Date(currentYear, currentMonth - 1 - monthsAgo, 1)
      return {
        month: `T${date.getMonth() + 1}/${date.getFullYear()}`,
        revenue: 0,
        orders: 0
      }
    })
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu theo tháng</CardTitle>
        <CardDescription>
          Doanh thu từ các đơn hàng đã giao
          {data.length > 0 && ` (${data.length} tháng có doanh thu)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  zIndex: 1000,
                }}
                wrapperStyle={{ zIndex: 1000 }}
                cursor={{ fill: 'hsl(var(--primary))', fillOpacity: 0.1 }}
                labelFormatter={(label) => `Tháng: ${label}`}
                formatter={(value: any, name: string) => {
                  // Debug log
                  console.log('Tooltip - name:', name, 'value:', value, 'type:', typeof value)
                  
                  if (name === 'revenue') {
                    // Đảm bảo value là number
                    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
                    return [
                      `${numValue.toLocaleString('vi-VN')}₫`,
                      'Doanh thu'
                    ]
                  }
                  if (name === 'orders') {
                    return [value, 'Số đơn hàng']
                  }
                  return [value, name]
                }}
              />
              <Legend 
                formatter={(value) => {
                  if (value === 'revenue') return 'Doanh thu (₫)'
                  if (value === 'orders') return 'Số đơn hàng'
                  return value
                }}
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
                name="revenue"
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
