# 🖼️ Hướng Dẫn Setup Cloudinary Upload

## Bước 1: Đăng ký tài khoản Cloudinary (FREE)

1. Truy cập: https://cloudinary.com/users/register/free
2. Đăng ký tài khoản miễn phí (25GB/tháng, 25K transformations)
3. Xác nhận email

## Bước 2: Lấy thông tin cấu hình

Sau khi đăng nhập Cloudinary:

1. Vào **Dashboard** (https://console.cloudinary.com/console)
2. Ghi lại các thông tin sau:

```
Cloud Name: [Ví dụ: dxxxxxxxx]
API Key: [Ví dụ: 123456789012345]
API Secret: [Ví dụ: abcdefghijklmnopqrstuvwxyz]
```

## Bước 3: Tạo Upload Preset

1. Vào **Settings** → **Upload** tab
2. Scroll xuống phần **Upload presets**
3. Click **Add upload preset**
4. Cấu hình:
   - **Preset name**: `lamdong_products` (hoặc tên tùy chọn)
   - **Signing Mode**: **Unsigned** (quan trọng!)
   - **Folder**: `lamdong-app/products` (tùy chọn)
   - **Use filename**: Checked ✓
   - **Unique filename**: Checked ✓
5. Click **Save**

## Bước 4: Cập nhật code

Mở file `components/ui/image-upload.tsx` và thay đổi:

```typescript
// Dòng 18-19, thay đổi các giá trị sau:
const CLOUDINARY_CLOUD_NAME = "dxxxxxxxx" // Thay bằng Cloud Name của bạn
const CLOUDINARY_UPLOAD_PRESET = "lamdong_products" // Thay bằng Upload Preset của bạn
```

## Bước 5: Test Upload

1. Restart dev server: `npm run dev`
2. Vào trang Admin Products: http://localhost:3000/admin/products
3. Click "Thêm sản phẩm" → Kéo thả hình ảnh
4. Kiểm tra hình đã upload lên Cloudinary

## 🎨 Tính năng đã có:

✅ **Drag & Drop** - Kéo thả file vào vùng upload  
✅ **Preview** - Xem trước hình trước khi lưu sản phẩm  
✅ **Upload to Cloudinary** - Tự động upload và lấy URL  
✅ **Loading State** - Hiển thị trạng thái đang upload  
✅ **Error Handling** - Thông báo lỗi nếu upload fail  
✅ **Remove Image** - Nút xóa hình đã chọn  
✅ **File Type Validation** - Chỉ chấp nhận PNG, JPG, GIF, WebP  

## 📸 Cloudinary Dashboard

Xem các hình đã upload tại:
https://console.cloudinary.com/console/media_library

## 🔒 Bảo mật

- **Unsigned Upload** được sử dụng cho client-side upload
- Không cần API Secret ở frontend
- Upload preset control quyền upload
- Có thể giới hạn file size, format trong preset settings

## 🆓 Free Plan Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/tháng
- **Transformations**: 25,000/tháng
- **Request**: Unlimited


