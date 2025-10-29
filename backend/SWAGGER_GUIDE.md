# Swagger API Documentation

## Overview

Dự án đã được tích hợp **Swagger UI** để cung cấp tài liệu API tương tác đầy đủ. Swagger UI cho phép bạn:
- Xem tất cả các endpoints API
- Xem chi tiết request/response schemas
- Test API trực tiếp từ browser
- Xác thực với JWT token

## Truy cập Swagger UI

### Development
Sau khi khởi động backend server:

```bash
cd backend
npm run dev
```

Truy cập Swagger UI tại:
```
http://localhost:5000/api-docs
```

### Production
```
https://your-domain.com/api-docs
```

## Cách sử dụng

### 1. Xem danh sách API Endpoints

Swagger UI hiển thị tất cả endpoints được nhóm theo tags:
- **Authentication** - Đăng ký, đăng nhập, quản lý profile
- **Products** - Quản lý sản phẩm
- **Orders** - Quản lý đơn hàng
- **Users** - Quản lý người dùng (Admin)

### 2. Test API không cần authentication

Các endpoint công khai như:
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/{id}` - Xem chi tiết sản phẩm
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập

**Cách test:**
1. Click vào endpoint muốn test
2. Click nút **"Try it out"**
3. Nhập parameters (nếu có)
4. Click **"Execute"**
5. Xem kết quả response bên dưới

### 3. Test API cần authentication

Các endpoint yêu cầu JWT token:
- `GET /auth/profile` - Xem profile
- `POST /orders` - Tạo đơn hàng
- `GET /orders` - Xem đơn hàng (Admin)

**Cách authenticate:**

1. **Đăng nhập để lấy token:**
   - Vào endpoint `POST /auth/login`
   - Click "Try it out"
   - Nhập credentials:
   ```json
   {
     "email": "user@example.com",
     "password": "yourpassword"
   }
   ```
   - Execute và copy token từ response

2. **Thêm token vào Swagger:**
   - Click nút **"Authorize"** ở góc phải trên
   - Nhập: `Bearer YOUR_TOKEN_HERE` (có chữ "Bearer" ở đầu)
   - Click "Authorize"
   - Click "Close"

3. **Test protected endpoints:**
   - Bây giờ bạn có thể test các endpoint cần authentication
   - Token sẽ tự động được gửi trong header

### 4. Admin Endpoints

Để test admin endpoints:
1. Đăng nhập với tài khoản admin:
```json
{
  "email": "admin@dacsanlamdong.vn",
  "password": "admin123"
}
```
2. Authorize với token nhận được
3. Test các admin endpoints:
   - `GET /auth/users` - Danh sách users
   - `DELETE /auth/users/{id}` - Xóa user
   - `GET /orders` - Tất cả đơn hàng
   - `PUT /orders/{id}/status` - Cập nhật trạng thái đơn

## API Endpoints Summary

### Authentication
```
POST   /api/v1/auth/register      - Đăng ký user mới
POST   /api/v1/auth/login         - Đăng nhập
GET    /api/v1/auth/profile       - Xem profile (Auth)
PUT    /api/v1/auth/profile       - Cập nhật profile (Auth)
```

### Products
```
GET    /api/v1/products           - Danh sách sản phẩm (filter, search, sort, pagination)
GET    /api/v1/products/{id}      - Chi tiết sản phẩm
POST   /api/v1/products           - Tạo sản phẩm (Admin)
PUT    /api/v1/products/{id}      - Cập nhật sản phẩm (Admin)
DELETE /api/v1/products/{id}      - Xóa sản phẩm (Admin)
```

### Orders
```
POST   /api/v1/orders             - Tạo đơn hàng (Auth)
GET    /api/v1/orders             - Tất cả đơn hàng (Admin)
GET    /api/v1/orders/user/{id}   - Đơn hàng của user (Auth)
GET    /api/v1/orders/{id}        - Chi tiết đơn hàng (Auth)
PUT    /api/v1/orders/{id}/status - Cập nhật trạng thái (Admin)
PUT    /api/v1/orders/{id}/cancel - Hủy đơn hàng (Auth)
```

### Users (Admin only)
```
GET    /api/v1/auth/users         - Danh sách users (Admin)
DELETE /api/v1/auth/users/{id}    - Xóa user (Admin)
```

## Query Parameters Examples

### Products Filtering
```
GET /api/v1/products?category=coffee&min_price=100000&max_price=500000&in_stock=true
```

### Pagination
```
GET /api/v1/products?page=2&limit=10
```

### Search
```
GET /api/v1/products?search=cà phê
```

### Sorting
```
GET /api/v1/products?sort=price&order=asc
```

### Combined
```
GET /api/v1/products?category=coffee&search=arabica&sort=rating&order=desc&page=1&limit=20
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Schemas

Swagger UI hiển thị chi tiết các schemas:
- **User** - Thông tin người dùng
- **Product** - Thông tin sản phẩm
- **Order** - Thông tin đơn hàng
- **Error** - Format lỗi
- **Success** - Format thành công

Click vào từng endpoint để xem request/response schema chi tiết.

## Testing Tips

### 1. Test Registration Flow
```
1. POST /auth/register (tạo user mới)
2. POST /auth/login (đăng nhập)
3. Authorize với token
4. GET /auth/profile (xem profile)
5. PUT /auth/profile (cập nhật profile)
```

### 2. Test Shopping Flow
```
1. GET /products (xem sản phẩm)
2. GET /products/{id} (xem chi tiết)
3. POST /auth/login (đăng nhập)
4. Authorize với token
5. POST /orders (tạo đơn hàng)
6. GET /orders/user/{userId} (xem đơn hàng)
```

### 3. Test Admin Flow
```
1. POST /auth/login (login với admin account)
2. Authorize với admin token
3. GET /auth/users (xem danh sách users)
4. GET /orders (xem tất cả đơn hàng)
5. PUT /orders/{id}/status (cập nhật trạng thái)
6. POST /products (tạo sản phẩm mới)
```

## Advanced Features

### Filter by multiple criteria
```json
{
  "category": "coffee",
  "min_price": 100000,
  "max_price": 500000,
  "in_stock": true,
  "search": "arabica",
  "sort": "rating",
  "order": "desc",
  "page": 1,
  "limit": 10
}
```

### Create Order with multiple items
```json
{
  "user_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 250000
    },
    {
      "product_id": 2,
      "quantity": 1,
      "price": 180000
    }
  ],
  "shipping_address": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "user@example.com",
    "address": "123 Đường ABC",
    "city": "Đà Lạt",
    "district": "Phường 1",
    "ward": "Xã 1"
  },
  "payment_method": "cod",
  "notes": "Giao vào buổi sáng"
}
```

## Troubleshooting

### Token expired
- Login lại để lấy token mới
- Token có hiệu lực 7 ngày

### 403 Forbidden
- Endpoint yêu cầu quyền admin
- Đảm bảo đăng nhập với admin account

### 401 Unauthorized
- Chưa authorize hoặc token không hợp lệ
- Click "Authorize" và nhập token mới

### Validation errors
- Kiểm tra request body schema
- Đảm bảo các required fields đều có
- Kiểm tra format (email, phone, etc.)

## Customization

Swagger config có thể tùy chỉnh tại:
```
backend/src/config/swagger.ts
```

Các tuỳ chọn:
- Thay đổi title, description
- Thêm servers (staging, production)
- Thêm schemas mới
- Thêm tags mới
- Cấu hình authentication methods

## Development

Để thêm documentation cho endpoint mới:

```typescript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Your endpoint description
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/your-endpoint', handler);
```

Sau đó rebuild:
```bash
npm run build
npm run dev
```

## Support

Nếu có vấn đề với Swagger UI:
1. Kiểm tra console log của browser
2. Kiểm tra backend server logs
3. Đảm bảo backend đang chạy
4. Clear browser cache và reload

---

**Happy Testing! 🚀**
