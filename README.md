# ✅ TaskFlow — Quản Lý Công Việc

Ứng dụng quản lý công việc (TodoList) fullstack với giao diện hiện đại, hỗ trợ chế độ sáng/tối, xác thực JWT, và bộ lọc thông minh.

---

## 📋 Tổng Quan

TaskFlow giúp người dùng quản lý công việc hàng ngày với các tính năng:

- **Đăng ký / Đăng nhập** tài khoản cá nhân
- **Thêm / Sửa / Xóa** công việc
- **Đánh dấu** hoàn thành / chưa làm
- **Lọc** theo thời gian (hôm nay, tuần này, tháng này) và trạng thái
- **Giao diện** hiện đại với 2 chế độ sáng và tối

---

## 🏗️ Kiến Trúc Dự Án

```
DB_Test/
├── BE_Expressjs/          ← Backend API
│   └── src/
│       ├── config/        # Cấu hình DB (TypeORM) + Security (JWT)
│       ├── controllers/   # Xử lý request/response
│       ├── service/       # Business logic
│       ├── repository/    # Truy vấn database
│       ├── models/
│       │   ├── entity/    # Entity schemas (Task, User, RefreshToken)
│       │   └── dto/       # Data Transfer Objects
│       ├── routes/        # Định tuyến API
│       └── server.js      # Entry point
│
├── FE/                    ← Frontend App
│   └── src/
│       ├── contexts/      # Auth & Theme state management
│       ├── hooks/         # Custom hooks (Axios instance)
│       ├── services/      # Gọi API backend
│       ├── pages/         # Các trang (Login, Register, Dashboard, 404)
│       ├── components/    # UI components (TaskCard, TaskFilter, ...)
│       ├── App.jsx        # Root component + Routing
│       ├── main.jsx       # Entry point
│       └── index.css      # Design system + Theme
│
└── README.md              ← File này
```

---

## ⚙️ Tech Stack

### Backend

| Thành phần | Công nghệ |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | TypeORM |
| Xác thực | JWT (Access Token + Refresh Token) |
| Mã hóa | bcrypt |

### Frontend

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | TailwindCSS v4 |
| Routing | React Router v8 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | Sonner |
| Font | Inter (Google Fonts) |

---

## 🔌 API Endpoints

### Auth (`/api/auth`) — Public

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/register` | Đăng ký tài khoản mới |
| POST | `/login` | Đăng nhập, nhận Access + Refresh Token |
| POST | `/logout` | Đăng xuất, thu hồi Refresh Token |
| POST | `/refresh` | Làm mới Access Token bằng Refresh Token |

### Tasks (`/api/tasks`) — Yêu cầu JWT

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/` | Lấy danh sách công việc (hỗ trợ filter) |
| GET | `/:id` | Lấy công việc theo ID |
| POST | `/` | Tạo công việc mới |
| PUT | `/:id` | Cập nhật công việc (title, status) |
| DELETE | `/:id` | Xóa công việc |

### Bộ Lọc (Query Parameters cho `GET /api/tasks`)

| Param | Giá trị | Mặc định | Mô tả |
|---|---|---|---|
| `filter` | `all` &#124; `today` &#124; `week` &#124; `month` | `all` | Lọc theo khoảng thời gian |
| `status` | `true` &#124; `false` | tất cả | Lọc theo trạng thái hoàn thành |

**Ví dụ:**
```
GET /api/tasks                          → Tất cả, mới nhất trước
GET /api/tasks?filter=today             → Công việc hôm nay
GET /api/tasks?filter=week&status=false → Chưa làm trong tuần này
```

---

## 📦 Cài Đặt & Chạy

### Yêu cầu
- Node.js >= 18
- PostgreSQL

### 1. Backend

```bash
cd BE_Expressjs
npm install
```

Tạo file `.env`:
```env
SERVER_PORT=1234
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Chạy:
```bash
npm run dev
```

### 2. Frontend

```bash
cd FE
npm install
npm run dev
```

Truy cập: **http://localhost:5173**

---

## 🎨 Giao Diện

### Tính năng UI

- **Chế độ Sáng / Tối**: Chuyển đổi mượt mà, lưu tùy chọn vào localStorage
- **Glassmorphism**: Hiệu ứng kính mờ cho cards và panels
- **Micro-animations**: Hiệu ứng fadeIn, slideUp, bounce cho tương tác
- **Responsive**: Tương thích desktop, tablet, mobile
- **Ngôn ngữ**: Tiếng Việt

### Luồng Sử Dụng

```
Đăng ký → Đăng nhập → Dashboard
                         ├── Thêm công việc mới
                         ├── Sửa tiêu đề (double-click)
                         ├── Đánh dấu hoàn thành (checkbox)
                         ├── Xóa công việc
                         ├── Lọc: Tất cả | Hôm nay | Tuần này | Tháng này
                         ├── Lọc: Tất cả | Hoàn thành | Chưa làm
                         ├── Chuyển đổi sáng / tối
                         └── Đăng xuất
```

---

## 📄 Giấy Phép

Dự án này được phát triển cho mục đích học tập.
