# Hướng dẫn Setup Database PostgreSQL

## 1. Khởi động PostgreSQL Service

### Trên Windows:
1. Mở **Services** (Windows + R, gõ `services.msc`)
2. Tìm **postgresql-x64-17** 
3. Click phải và chọn **Start** (nếu chưa chạy)

Hoặc sử dụng Command Prompt (Run as Administrator):
```cmd
net start postgresql-x64-17
```

## 2. Mở pgAdmin 4

1. Tìm **pgAdmin 4** trong Start Menu và mở
2. Sẽ mở trình duyệt với giao diện pgAdmin
3. Lần đầu sẽ yêu cầu tạo Master Password - tạo và nhớ mật khẩu này

## 3. Kết nối Database

1. Trong pgAdmin, click **Servers** ở sidebar trái
2. Click phải **PostgreSQL 17** và chọn **Connect Server**
3. Nhập password của user postgres (đã tạo khi cài PostgreSQL)

## 4. Tạo Database

1. Click phải **PostgreSQL 17** → **Create** → **Database**
2. Điền thông tin:
   - **Database name**: `lamdongapp_db`
   - **Owner**: postgres (hoặc user bạn muốn)
   - **Comment**: Database for Lam Dong Specialties App
3. Click **Save**

## 5. Chạy Database Schema

1. Click vào database `lamdongapp_db` vừa tạo
2. Click **Tools** → **Query Tool**
3. Mở file `database_schema.sql` 
4. Copy toàn bộ nội dung và paste vào Query Tool
5. Click nút **Execute** (⚡) hoặc F5

## 6. Cập nhật Environment Variables

Mở file `backend\.env` và cập nhật:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lamdongapp_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

**Lưu ý**: Thay `your_postgres_password` bằng mật khẩu thực tế của user postgres.

## 7. Test Connection

```bash
cd backend
npm run dev
```

Nếu thành công, bạn sẽ thấy:
```
✅ Database connected successfully at: 2025-09-24T...
🚀 Server running on port 5000
```

## 8. Verify Database Tables

Trong pgAdmin:
1. Expand `lamdongapp_db` → **Schemas** → **public** → **Tables**
2. Bạn sẽ thấy các tables:
   - users
   - products
   - categories
   - cart_items
   - orders
   - order_items
   - reviews

## 9. Check Sample Data

Chạy query để kiểm tra dữ liệu mẫu:
```sql
-- Kiểm tra products
SELECT * FROM products;

-- Kiểm tra admin user
SELECT id, email, name, role FROM users WHERE role = 'admin';

-- Kiểm tra categories
SELECT * FROM categories;
```

## Troubleshooting

### Lỗi kết nối database:
- Kiểm tra PostgreSQL service đã chạy chưa
- Xác nhận username/password trong .env file
- Kiểm tra port 5432 có bị block không

### Lỗi permission:
```sql
-- Cấp quyền cho user (nếu cần)
GRANT ALL PRIVILEGES ON DATABASE lamdongapp_db TO your_username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
```

### Reset database (nếu cần):
```sql
-- Xóa tất cả tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Sau đó chạy lại database_schema.sql
```