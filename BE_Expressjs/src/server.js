import express from 'express'
import tasksRouter from './routes/tasksRouters.js'
import authRouter from './routes/authRouters.js'
import AppDataSource from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const PORT = process.env.SERVER_PORT || 1234

const app = express();

// Middleware
app.use(express.json());  // ← Thêm để parse JSON

app.use(cors({ origin: ["http://localhost:5173"] }))

// puplic routers
app.use("/api/auth", authRouter)

// private routers
// sử dụng API ở tasksRouter với tiền tố /api/tasks
app.use("/api/tasks", tasksRouter)



// Kết nối database qua TypeORM rồi start server
AppDataSource.initialize()
    .then(() => {
        console.log("TypeORM: Kết nối database thành công!");
        app.listen(PORT, () => {
            console.log("Server đang hoạt động trên cổng " + PORT);
        });
    })
    .catch((error) => {
        console.error("TypeORM: Kết nối thất bại!", error)
    });
