import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { TaskSchema } from "../models/entity/Task.js";
import { UserSchema } from "../models/entity/User.js";

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,   // Tự đồng bộ schema → DB (chỉ dùng trong dev)
    logging: true,        // Log SQL queries ra console
    // Import trực tiếp entity schemas (đáng tin cậy hơn glob pattern với ESM)
    entities: [TaskSchema, UserSchema],
    // pool size tương đương config cũ
    extra: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    },
});
export default AppDataSource
