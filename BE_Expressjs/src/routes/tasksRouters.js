import express from "express";
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/tasksController.js";

const router = express.Router();

/**
 * Routes xử lý các request từ client
 * Tiền tố: /api/tasks
 * 
 * GET    /api/tasks           - Lấy tất cả nhiệm vụ
 * GET    /api/tasks/:id       - Lấy nhiệm vụ theo ID
 * POST   /api/tasks           - Tạo nhiệm vụ mới
 * PUT    /api/tasks/:id       - Cập nhật nhiệm vụ
 * DELETE /api/tasks/:id       - Xóa nhiệm vụ
 */

// GET - Lấy tất cả nhiệm vụ
router.get("/", getAllTasks);

// GET - Lấy nhiệm vụ theo ID
router.get("/:id", getTaskById);

// POST - Tạo nhiệm vụ mới
router.post("/", createTask);

// PUT - Cập nhật nhiệm vụ
router.put("/:id", updateTask);

// DELETE - Xóa nhiệm vụ
router.delete("/:id", deleteTask);

export default router;