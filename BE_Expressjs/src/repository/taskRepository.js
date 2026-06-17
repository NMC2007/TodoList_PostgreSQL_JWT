import AppDataSource from "../config/db.js";
import { TaskSchema } from "../models/entity/Task.js";

// Lấy repository của entity "Task" từ TypeORM DataSource
const taskRepo = AppDataSource.getRepository(TaskSchema);

/**
 * GET ALL - Lấy tất cả nhiệm vụ
 */
export const getAllTasks = async () => {
    try {
        return await taskRepo.find({ order: { id: "DESC" } });
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách nhiệm vụ: " + error.message);
    }
};

/**
 * GET BY ID - Lấy nhiệm vụ theo ID
 */
export const getTaskById = async (id) => {
    try {
        return await taskRepo.findOneBy({ id: parseInt(id) });
    } catch (error) {
        throw new Error("Lỗi khi lấy nhiệm vụ: " + error.message);
    }
};

/**
 * CREATE - Tạo nhiệm vụ mới
 */
export const createTask = async (title) => {
    try {
        const task = taskRepo.create({ title, status: false });
        return await taskRepo.save(task);
    } catch (error) {
        throw new Error("Lỗi khi tạo nhiệm vụ: " + error.message);
    }
};

/**
 * UPDATE - Cập nhật nhiệm vụ
 */
export const updateTask = async (id, title, status) => {
    try {
        const updateData = { update_at: new Date() };

        if (title !== undefined) {
            updateData.title = title;
        }

        if (status !== undefined) {
            updateData.status = status;
            // Nếu status = true, cập nhật completed_at
            updateData.completed_at = status ? new Date() : null;
        }

        await taskRepo.update(id, updateData);
        return await taskRepo.findOneBy({ id: parseInt(id) });
    } catch (error) {
        throw new Error("Lỗi khi cập nhật nhiệm vụ: " + error.message);
    }
};

/**
 * DELETE - Xóa nhiệm vụ
 */
export const deleteTask = async (id) => {
    try {
        const task = await taskRepo.findOneBy({ id: parseInt(id) });
        await taskRepo.delete(id);
        return task;
    } catch (error) {
        throw new Error("Lỗi khi xóa nhiệm vụ: " + error.message);
    }
};