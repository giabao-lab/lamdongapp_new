# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN LAMDONGAPP

**Dự án:** Website Thương mại Điện tử Đặc Sản Lâm Đồng  
**Tech Stack:** Next.js 14 + TypeScript + PostgreSQL + Express.js  
**Version:** 1.0.0

---

## MỤC LỤC

1. [Yêu Cầu Hệ Thống](#1-yêu-cầu-hệ-thống)
2. [Cài Đặt Dependencies](#2-cài-đặt-dependencies)
3. [Setup Database PostgreSQL](#3-setup-database-postgresql)
4. [Setup Cloudinary](#4-setup-cloudinary)
5. [Cấu Hình Environment Variables](#5-cấu-hình-environment-variables)
6. [Chạy Dự Án](#6-chạy-dự-án)
7. [Truy Cập Swagger API Documentation](#7-truy-cập-swagger-api-documentation)
8. [Tài Khoản Mặc Định](#8-tài-khoản-mặc-định)
9. [Cấu Trúc Dự Án](#9-cấu-trúc-dự-án)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. YÊU CẦU HỆ THỐNG

### Phần mềm cần cài đặt:

| Phần mềm | Version | Link Download |
|----------|---------|---------------|
| **Node.js** | >= 18.x | https://nodejs.org |
| **pnpm** | Latest | `npm install -g pnpm` |
| **PostgreSQL** | >= 17.x | https://www.postgresql.org/download/ |
| **pgAdmin 4** | Latest | Đi kèm với PostgreSQL |
| **Git** | Latest | https://git-scm.com |
| **VS Code** | Latest (khuyến nghị) | https://code.visualstudio.com |

### Kiểm tra version đã cài:

```bash
node --version    # v18.x hoặc cao hơn
npm --version     # v9.x hoặc cao hơn
pnpm --version    # Latest
git --version     # Latest
```

---

## 2. CÀI ĐẶT DEPENDENCIES

### Bước 1: Clone Repository

```bash
git clone https://github.com/giabao-lab/lamdongapp_new.git
cd lamdongapp_new
```

### Bước 2: Cài đặt Frontend Dependencies

```bash
# Ở thư mục root
pnpm install
```

### Bước 3: Cài đặt Backend Dependencies

```bash
cd backend
npm install
cd ..
```

**Lưu ý:** Nếu gặp lỗi khi cài đặt, thử:
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 3. SETUP DATABASE POSTGRESQL

### Bước 1: Cài đặt PostgreSQL 17

1. Download PostgreSQL 17 tại: https://www.postgresql.org/download/
2. Chạy installer và làm theo hướng dẫn
3. **Quan trọng:** Nhớ mật khẩu cho user `postgres`
4. Port mặc định: `5432`

### Bước 2: Khởi động PostgreSQL Service

**Trên Windows:**
```cmd
# Mở Services (Windows + R, gõ services.msc)
# Tìm "postgresql-x64-17" và Start

# Hoặc dùng Command Prompt (Run as Administrator)
net start postgresql-x64-17
```

**Trên MacOS:**
```bash
brew services start postgresql@17
```

**Trên Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Bước 3: Tạo Database

**Cách 1: Sử dụng pgAdmin 4 (Khuyến nghị)**

1. Mở **pgAdmin 4**
2. Connect tới PostgreSQL 17 (nhập password đã tạo)
3. Click phải **Databases** → **Create** → **Database**
4. Nhập thông tin:
   - **Database name:** `lamdongapp_db`
   - **Owner:** `postgres`
   - **Comment:** `Database for Lam Dong Specialties App`
5. Click **Save**

**Cách 2: Sử dụng Command Line**

```bash
# Mở psql
psql -U postgres

# Tạo database
CREATE DATABASE lamdongapp_db;

# Kiểm tra
\l

# Thoát
\q
```

### Bước 4: Import Database Schema

1. Trong pgAdmin 4, click vào database `lamdongapp_db`
2. Click **Tools** → **Query Tool**
3. Mở file `backend/database_schema.sql`
4. Copy toàn bộ nội dung
5. Paste vào Query Tool
6. Click **Execute** (⚡) hoặc nhấn **F5**

**Hoặc dùng Command Line:**

```bash
cd backend
psql -U postgres -d lamdongapp_db -f database_schema.sql
```

### Bước 5: Verify Database

Trong pgAdmin hoặc psql, chạy query:

```sql
-- Kiểm tra tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Kiểm tra sample products
SELECT id, name, price, category FROM products;

-- Kiểm tra admin user
SELECT email, name, role FROM users WHERE role = 'admin';
```

**Kết quả mong đợi:**
- 7 tables: users, products, categories, cart_items, orders, order_items, reviews
- 5 sample products
- 1 admin user
- 5 categories

---

## 4. SETUP CLOUDINARY

### Bước 1: Đăng ký tài khoản Cloudinary (FREE)

1. Truy cập: https://cloudinary.com/users/register/free
2. Đăng ký tài khoản (email hoặc Google)
3. Xác nhận email
4. **Free plan:** 25GB storage, 25GB bandwidth/tháng

### Bước 2: Lấy API Credentials

1. Đăng nhập vào Cloudinary
2. Vào **Dashboard**: https://console.cloudinary.com/console
3. Ghi lại thông tin:
   ```
   Cloud Name: [Ví dụ: dxxxxxxxx]
   API Key: [Ví dụ: 123456789012345]
   API Secret: [Ví dụ: abcdefghijklmnopqrstuvwxyz]
   ```

### Bước 3: Tạo Upload Preset

1. Vào **Settings** → **Upload** tab
2. Scroll xuống **Upload presets**
3. Click **Add upload preset**
4. Cấu hình:
   - **Preset name:** `lamdong_products`
   - **Signing Mode:** **Unsigned** (quan trọng!)
   - **Folder:** `lamdong-app/products`
   - **Use filename:** ✓ Checked
   - **Unique filename:** ✓ Checked
   - **Allowed formats:** jpg, png, gif, webp
   - **Max file size:** 10 MB
5. Click **Save**

### Bước 4: Cập nhật Frontend Code

Mở file `components/ui/image-upload.tsx` và sửa dòng 18-19:

```typescript
// Thay đổi các giá trị này
const CLOUDINARY_CLOUD_NAME = "your_cloud_name"      // Thay bằng Cloud Name
const CLOUDINARY_UPLOAD_PRESET = "lamdong_products"  // Thay bằng Upload Preset
```

### Bước 5: Test Upload

1. Chạy frontend: `npm run dev`
2. Truy cập: http://localhost:3000/admin/products
3. Click "Thêm sản phẩm"
4. Kéo thả hình ảnh vào upload zone
5. Kiểm tra hình đã upload tại: https://console.cloudinary.com/console/media_library

**Chi tiết thêm:** Xem file `CLOUDINARY_SETUP.md`

---

## 5. CẤU HÌNH ENVIRONMENT VARIABLES

### Backend Environment (.env)

Tạo file `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lamdongapp_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration (Optional - nếu upload từ backend)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Quan trọng:**
- Thay `your_postgres_password_here` bằng mật khẩu PostgreSQL của bạn
- Thay `your_super_secret_jwt_key_here` bằng một chuỗi bí mật mạnh
- Thay các giá trị Cloudinary nếu sử dụng backend upload

### Frontend Environment (.env.local)

Tạo file `.env.local` ở thư mục root:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Cloudinary (nếu cần)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=lamdong_products
```

---

## 6. CHẠY DỰ ÁN

### Phương án 1: Chạy Frontend và Backend riêng biệt

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Output mong đợi:
```
✅ Database connected successfully
🚀 Server running on port 5000
📚 Swagger docs available at http://localhost:5000/api-docs
```

**Terminal 2 - Frontend:**
```bash
# Ở thư mục root
npm run dev
```

Output mong đợi:
```
▲ Next.js 14.2.16
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Phương án 2: Sử dụng PowerShell Script (Windows)

```powershell
# Ở thư mục root
.\start-dev.ps1
```

Script này sẽ tự động:
1. Khởi động backend ở port 5000
2. Khởi động frontend ở port 3000
3. Mở 2 terminal riêng biệt

### Phương án 3: Build Production

```bash
# Build frontend
npm run build
npm start

# Build backend
cd backend
npm run build
npm start
```

---

## 7. TRUY CẬP SWAGGER API DOCUMENTATION

### Sau khi backend đã chạy:

```
http://localhost:5000/api-docs
```

### Tính năng Swagger UI:

✅ Xem tất cả API endpoints  
✅ Xem chi tiết request/response schemas  
✅ Test API trực tiếp từ browser  
✅ Authentication với JWT token  
✅ Xem ví dụ request/response  

### Cách sử dụng Swagger:

1. **Test endpoint công khai:**
   - Click vào endpoint (VD: `GET /products`)
   - Click "Try it out"
   - Click "Execute"
   - Xem response

2. **Test endpoint cần authentication:**
   - Login qua `POST /auth/login`
   - Copy token từ response
   - Click nút **"Authorize"** ở góc phải
   - Nhập: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize" → "Close"
   - Test các protected endpoints

**Chi tiết thêm:** Xem file `backend/SWAGGER_GUIDE.md`

---

## 8. TÀI KHOẢN MẶC ĐỊNH

### Admin Account:
```
Email: admin@dacsanlamdong.vn
Password: admin123
Role: admin
```

### Customer Account:
```
Email: user@example.com
Password: user123
Role: customer
```

### Test với Swagger:

1. Vào http://localhost:5000/api-docs
2. Tìm endpoint `POST /api/v1/auth/login`
3. Click "Try it out"
4. Nhập credentials admin
5. Execute và lấy token
6. Authorize với token để test admin APIs

---

## 9. CẤU TRÚC DỰ ÁN

```
lamdongapp/
├── app/                          # Next.js App Router (Frontend)
│   ├── page.tsx                 # Trang chủ
│   ├── about/                   # Trang giới thiệu
│   ├── products/                # Trang sản phẩm
│   ├── cart/                    # Giỏ hàng
│   ├── checkout/                # Thanh toán
│   ├── orders/                  # Đơn hàng
│   ├── profile/                 # Thông tin cá nhân
│   ├── auth/                    # Đăng nhập/Đăng ký
│   └── admin/                   # Admin dashboard
│       ├── products/            # Quản lý sản phẩm
│       ├── orders/              # Quản lý đơn hàng
│       ├── users/               # Quản lý users
│       └── system-status/       # Trạng thái hệ thống
│
├── backend/                      # Backend API (Express.js)
│   ├── src/
│   │   ├── server.ts            # Main server
│   │   ├── config/              # Configuration
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Middleware
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   └── utils/               # Utilities
│   ├── database_schema.sql      # Database schema
│   ├── .env                     # Backend environment
│   └── package.json
│
├── components/                   # React Components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── products/                # Product components
│   └── auth/                    # Auth components
│
├── lib/                         # Services & Utilities
│   ├── api-client.ts           # API HTTP client
│   ├── auth-service.ts         # Authentication service
│   ├── products-service.ts     # Product service
│   ├── orders-service.ts       # Order service
│   ├── admin-service.ts        # Admin service
│   ├── auth-context.tsx        # Auth context
│   ├── cart-context.tsx        # Cart context
│   └── types.ts                # TypeScript types
│
├── public/                      # Static assets
├── .env.local                   # Frontend environment
├── package.json                 # Frontend dependencies
└── tsconfig.json               # TypeScript config
```

---

## 10. TROUBLESHOOTING

### Lỗi: "Cannot connect to database"

**Nguyên nhân:** PostgreSQL service chưa chạy hoặc sai credentials

**Giải pháp:**
```bash
# Windows
net start postgresql-x64-17

# Kiểm tra .env
# Đảm bảo DB_PASSWORD đúng với password PostgreSQL
```

### Lỗi: "Port 5000 already in use"

**Nguyên nhân:** Port đã bị chiếm bởi process khác

**Giải pháp:**
```bash
# Windows - Tìm và kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Hoặc đổi port trong backend/.env
PORT=5001
```

### Lỗi: "Port 3000 already in use"

**Giải pháp:**
```bash
# Kill process
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc chạy với port khác
npm run dev -- -p 3001
```

### Lỗi: "Module not found"

**Giải pháp:**
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "JWT token invalid"

**Nguyên nhân:** Token hết hạn hoặc JWT_SECRET không khớp

**Giải pháp:**
- Login lại để lấy token mới
- Kiểm tra JWT_SECRET trong backend/.env

### Lỗi: "Cloudinary upload failed"

**Nguyên nhân:** Sai Cloud Name hoặc Upload Preset

**Giải pháp:**
1. Kiểm tra `components/ui/image-upload.tsx`
2. Đảm bảo Upload Preset là **Unsigned**
3. Kiểm tra network trong Chrome DevTools

### Database schema lỗi

**Giải pháp:**
```sql
-- Reset database
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Import lại schema
-- Dùng pgAdmin hoặc psql
\i backend/database_schema.sql
```

### CORS Error

**Nguyên nhân:** Backend không cho phép frontend origin

**Giải pháp:**
```env
# backend/.env
CORS_ORIGIN=http://localhost:3000

# Hoặc cho phép tất cả (chỉ development)
CORS_ORIGIN=*
```

### Build error "Type error"

**Giải pháp:**
```bash
# Xóa .next và rebuild
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

---

## 🎯 CHECKLIST SAU KHI CÀI ĐẶT

- [ ] PostgreSQL service đang chạy
- [ ] Database `lamdongapp_db` đã được tạo
- [ ] Database schema đã import thành công (7 tables)
- [ ] Backend `.env` đã cấu hình đúng
- [ ] Frontend `.env.local` đã cấu hình (nếu cần)
- [ ] Dependencies đã cài đặt (frontend & backend)
- [ ] Backend chạy thành công ở port 5000
- [ ] Frontend chạy thành công ở port 3000
- [ ] Swagger UI truy cập được tại http://localhost:5000/api-docs
- [ ] Login thành công với admin account
- [ ] Cloudinary upload hoạt động (optional)

---

## 📚 TÀI LIỆU THAM KHẢO

- **Database Setup:** `backend/DATABASE_SETUP.md`
- **Cloudinary Setup:** `CLOUDINARY_SETUP.md`
- **Swagger Guide:** `backend/SWAGGER_GUIDE.md`
- **Project Report:** `BAO_CAO_DU_AN.md`
- **API Documentation:** http://localhost:5000/api-docs

---

## 🆘 HỖ TRỢ

### GitHub Issues
https://github.com/giabao-lab/lamdongapp_new/issues

### Email
admin@dacsanlamdong.vn

### Documentation
- Next.js: https://nextjs.org/docs
- PostgreSQL: https://www.postgresql.org/docs/
- Express.js: https://expressjs.com/
- Swagger: https://swagger.io/docs/

---

## 📝 GHI CHÚ

### Development URLs:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **Swagger UI:** http://localhost:5000/api-docs
- **pgAdmin:** http://localhost:5050 (nếu cài standalone)

### Các lệnh hữu ích:

```bash
# Frontend
npm run dev          # Development
npm run build        # Production build
npm run start        # Start production
npm run lint         # Lint code

# Backend
cd backend
npm run dev          # Development với nodemon
npm run build        # Build TypeScript
npm start            # Production

# Database
psql -U postgres                    # Mở psql
psql -U postgres -d lamdongapp_db   # Connect to DB
pg_dump lamdongapp_db > backup.sql  # Backup
psql -U postgres -d lamdongapp_db < backup.sql  # Restore
```

---

**🎉 Chúc bạn code vui vẻ!**

**Version:** 1.0.0  
**Last Updated:** 29/10/2025  
**Author:** LamdongApp Team
