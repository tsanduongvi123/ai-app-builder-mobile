# Setup Guide - AI App Builder Mobile

Hướng dẫn chi tiết để cài đặt và chạy AI App Builder Mobile trên máy tính của bạn.

## Yêu Cầu Hệ Thống

- **Node.js**: 18.0.0 hoặc cao hơn
- **npm/pnpm**: Package manager
- **MySQL**: 5.7 hoặc cao hơn (hoặc MariaDB)
- **Git**: Để clone repository
- **Expo CLI**: Để chạy mobile app

## Bước 1: Clone Repository

```bash
git clone https://github.com/tsanduongvi123/ai-app-builder-mobile.git
cd ai-app-builder-mobile
```

## Bước 2: Cài Đặt Dependencies

```bash
# Sử dụng pnpm (khuyến nghị)
pnpm install

# Hoặc sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

## Bước 3: Cấu Hình Environment Variables

### Tạo file `.env` trong thư mục gốc

```bash
touch .env
```

### Thêm các biến sau vào `.env`:

```env
# Google Gemini API Key (bắt buộc)
GROQ_API_KEY=your_gemini_api_key_here

# Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/ai_app_builder

# Optional: Server Port
PORT=3000

# Optional: Node Environment
NODE_ENV=development
```

### Lấy Gemini API Key

1. Truy cập https://makersuite.google.com/app/apikey
2. Đăng nhập bằng Google Account
3. Click "Create API Key"
4. Copy API key vào file `.env`

## Bước 4: Cấu Hình Database

### Tạo Database MySQL

```bash
# Kết nối MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE ai_app_builder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Tạo user (optional)
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ai_app_builder.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

### Cập nhật DATABASE_URL trong `.env`

```env
# Nếu dùng root user
DATABASE_URL=mysql://root:password@localhost:3306/ai_app_builder

# Hoặc nếu dùng app_user
DATABASE_URL=mysql://app_user:secure_password@localhost:3306/ai_app_builder
```

### Chạy Database Migrations

```bash
pnpm db:push
```

Lệnh này sẽ:
- Tạo tất cả các bảng cần thiết
- Thiết lập relationships
- Tạo indexes

## Bước 5: Cài Đặt Expo CLI (Nếu chạy Mobile)

```bash
npm install -g expo-cli

# Hoặc sử dụng pnpm
pnpm add -g expo-cli
```

## Bước 6: Khởi Động Development Server

### Chạy cả Web và Mobile

```bash
pnpm dev
```

Lệnh này sẽ khởi động:
- **Backend Server**: http://localhost:3000
- **Frontend Web**: http://localhost:8081
- **Mobile Preview**: Scan QR code với Expo Go app

### Chạy riêng từng phần

```bash
# Chỉ chạy backend server
pnpm dev:server

# Chỉ chạy frontend (web)
pnpm dev:metro

# Chạy trên iOS (macOS only)
pnpm ios

# Chạy trên Android
pnpm android
```

## Bước 7: Truy Cập Ứng Dụng

### Web
- Mở browser: http://localhost:8081
- Hoặc truy cập qua public URL được cấp

### Mobile
- Cài đặt **Expo Go** app từ App Store hoặc Google Play
- Scan QR code hiển thị trên terminal
- App sẽ tự động load

## Xác Minh Cài Đặt

Chạy các lệnh sau để xác minh mọi thứ đã được cài đặt đúng:

```bash
# Kiểm tra Node.js
node --version

# Kiểm tra pnpm
pnpm --version

# Kiểm tra MySQL connection
mysql -u root -p -e "SELECT VERSION();"

# Kiểm tra dependencies
pnpm check

# Chạy tests
pnpm test
```

## Troubleshooting

### Lỗi: "Cannot find module"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Lỗi: "Database connection failed"

```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p -e "SELECT 1;"

# Kiểm tra DATABASE_URL trong .env
cat .env | grep DATABASE_URL

# Chạy migrations lại
pnpm db:push
```

### Lỗi: "API Key not found"

```bash
# Kiểm tra .env file tồn tại
cat .env | grep GROQ_API_KEY

# Nếu không có, thêm vào
echo "GROQ_API_KEY=your_key_here" >> .env

# Restart dev server
# Ctrl+C để dừng, rồi chạy lại pnpm dev
```

### Lỗi: "Port 8081 already in use"

```bash
# Sử dụng port khác
EXPO_PORT=8082 pnpm dev:metro

# Hoặc kill process đang dùng port
lsof -i :8081
kill -9 <PID>
```

### Lỗi: "Expo Go không kết nối"

```bash
# Đảm bảo cùng WiFi network
# Hoặc sử dụng USB cable

# Restart Expo
pnpm expo start --clear
```

## Cấu Hình Nâng Cao

### Sử dụng Database Khác

Ứng dụng hỗ trợ các database khác qua Drizzle ORM:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/ai_app_builder

# SQLite (development)
DATABASE_URL=file:./dev.db
```

### Cấu Hình HTTPS

Để chạy HTTPS locally:

```bash
# Tạo self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Sử dụng trong .env
HTTPS=true
SSL_CERT_PATH=./cert.pem
SSL_KEY_PATH=./key.pem
```

### Cấu Hình Proxy

Nếu đằng sau proxy:

```env
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
NO_PROXY=localhost,127.0.0.1
```

## Tiếp Theo

Sau khi cài đặt thành công:

1. 📖 Đọc [README.md](./README.md) để hiểu tổng quan
2. 🎨 Xem [design.md](./design.md) để hiểu UI/UX
3. 📝 Kiểm tra [todo.md](./todo.md) để xem features
4. 🚀 Bắt đầu tạo ứng dụng!

## Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra [Troubleshooting](#troubleshooting) section
2. Tìm kiếm trên [GitHub Issues](https://github.com/tsanduongvi123/ai-app-builder-mobile/issues)
3. Tạo issue mới với chi tiết lỗi

## Tài Liệu Thêm

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [tRPC Documentation](https://trpc.io)
- [NativeWind](https://www.nativewind.dev)

---

**Chúc bạn cài đặt thành công! 🎉**
