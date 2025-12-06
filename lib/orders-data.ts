interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

interface ShippingAddress {
  address: string
  city: string
  province: string
}

export interface Order {
  id: string
  customerInfo: CustomerInfo
  shippingAddress?: ShippingAddress
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

// Shared orders data for admin dashboard and orders page
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerInfo: {
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
    },
    shippingAddress: {
      address: "123 Đường Nguyễn Thị Minh Khai",
      city: "Đà Lạt",
      province: "Lâm Đồng",
    },
    items: [
      { name: "Cà phê Arabica Đà Lạt", quantity: 2, price: 250000 },
      { name: "Trà Atiso Đà Lạt", quantity: 1, price: 180000 },
    ],
    total: 680000,
    status: "delivered",
    createdAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    customerInfo: {
      name: "Trần Thị Bình",
      email: "binh.tran@email.com",
      phone: "0912345678",
    },
    shippingAddress: {
      address: "456 Đường Trần Hưng Đạo",
      city: "TP. Hồ Chí Minh",
      province: "TP. Hồ Chí Minh",
    },
    items: [
      { name: "Rượu vang Đà Lạt", quantity: 1, price: 450000 },
      { name: "Mứt dâu tây", quantity: 3, price: 120000 },
    ],
    total: 810000,
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "ORD-003",
    customerInfo: {
      name: "Lê Minh Cường",
      email: "cuong.le@email.com",
      phone: "0923456789",
    },
    shippingAddress: {
      address: "789 Đường Lê Lợi",
      city: "Hà Nội",
      province: "Hà Nội",
    },
    items: [{ name: "Dâu tây tươi Đà Lạt", quantity: 2, price: 150000 }],
    total: 300000,
    status: "pending",
    createdAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "ORD-004",
    customerInfo: {
      name: "Phạm Văn Đức",
      email: "duc.pham@email.com",
      phone: "0934567890",
    },
    shippingAddress: {
      address: "321 Đường Hai Bà Trưng",
      city: "Đà Nẵng",
      province: "Đà Nẵng",
    },
    items: [
      { name: "Cà phê Arabica Đà Lạt", quantity: 3, price: 250000 },
      { name: "Mứt dâu tây", quantity: 2, price: 85000 },
    ],
    total: 920000,
    status: "delivered",
    createdAt: "2024-12-10T14:20:00Z",
  },
  {
    id: "ORD-005",
    customerInfo: {
      name: "Hoàng Thị Mai",
      email: "mai.hoang@email.com",
      phone: "0945678901",
    },
    shippingAddress: {
      address: "654 Đường Lý Thường Kiệt",
      city: "Nha Trang",
      province: "Khánh Hòa",
    },
    items: [
      { name: "Rượu vang Đà Lạt", quantity: 2, price: 450000 },
    ],
    total: 900000,
    status: "delivered",
    createdAt: "2024-12-08T16:45:00Z",
  },
]
