# Messenger Clone Project

Một ứng dụng nhắn tin thời gian thực được lấy cảm hứng từ Facebook Messenger.

## 🚀 Công nghệ sử dụng

### Backend
- **Framework:** Spring Boot
- **Database:** SQL Server
- **Storage:** MinIO (Lưu trữ hình ảnh, file)
- **Caching & Real-time:** Redis
- **Security:** Spring Security & JWT

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** TanStack Query (React Query) / Context API
- **Icons:** Lucide React

## 📁 Cấu trúc thư mục
- `/BackEnd`: Mã nguồn phía server (Spring Boot).
- `/FE`: Mã nguồn phía client (Next.js).
- `Messenger.sql`: Script khởi tạo database.

## 🛠 Cài đặt

### Yêu cầu hệ thống
- Java 17+
- Node.js 18+
- SQL Server
- Docker (để chạy MinIO và Redis nhanh chóng)

### Phía Backend
1. Cấu hình file `application.properties` hoặc `application.yml` phù hợp với database và các service của bạn.
2. Chạy ứng dụng bằng Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

### Phía Frontend
1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
2. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```

## ✨ Tính năng chính
- Nhắn tin văn bản thời gian thực.
- Gửi hình ảnh, tệp tin thông qua MinIO.
- Thông báo tin nhắn mới.
- Quản lý danh sách bạn bè và phòng chat.
