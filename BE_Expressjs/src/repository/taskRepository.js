import AppDataSource from "../config/db.js";
import { TaskSchema } from "../models/entity/Task.js";

// Lấy repository của entity "Task" từ TypeORM DataSource
const taskRepo = AppDataSource.getRepository(TaskSchema);

/**
 * GET ALL - Lấy tất cả nhiệm vụ của user
 */
export const getAllTasks = async (userId, filters = {}, pagination = {}) => {
    try {
        const queryBuilder = taskRepo.createQueryBuilder("task")
            .where("task.user_id = :userId", { userId })
            .orderBy("task.created_at", "DESC");

        // Lọc theo trạng thái
        if (filters.status !== undefined) {
            queryBuilder.andWhere("task.status = :status", { 
                status: filters.status 
            });
        }

        // Lọc theo khoảng thời gian
        if (filters.dateFrom) {
            queryBuilder.andWhere("task.created_at >= :dateFrom", { 
                dateFrom: filters.dateFrom 
            });
        }

        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;

        queryBuilder.skip(skip).take(limit);

        const [tasks, total] = await queryBuilder.getManyAndCount();
        
        return {
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        };
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách nhiệm vụ: " + error.message);
    }
};

/**
 * GET BY ID - Lấy nhiệm vụ theo ID và User ID
 */
export const getTaskById = async (id, userId) => {
    try {
        return await taskRepo.findOneBy({ id: parseInt(id), user: { id: userId } });
    } catch (error) {
        throw new Error("Lỗi khi lấy nhiệm vụ: " + error.message);
    }
};

/**
 * CREATE - Tạo nhiệm vụ mới cho User
 */
export const createTask = async (title, userId) => {
    try {
        const task = taskRepo.create({ 
            title, 
            status: false,
            user: { id: userId }
        });
        return await taskRepo.save(task);
    } catch (error) {
        throw new Error("Lỗi khi tạo nhiệm vụ: " + error.message);
    }
};

/**
 * UPDATE - Cập nhật nhiệm vụ
 */
export const updateTask = async (id, title, status, userId) => {
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

        await taskRepo.update({ id: parseInt(id), user: { id: userId } }, updateData);
        return await taskRepo.findOneBy({ id: parseInt(id), user: { id: userId } });
    } catch (error) {
        throw new Error("Lỗi khi cập nhật nhiệm vụ: " + error.message);
    }
};

/**
 * DELETE - Xóa nhiệm vụ
 */
export const deleteTask = async (id, userId) => {
    try {
        const task = await taskRepo.findOneBy({ id: parseInt(id), user: { id: userId } });
        if (task) {
            await taskRepo.delete({ id: parseInt(id), user: { id: userId } });
        }
        return task;
    } catch (error) {
        throw new Error("Lỗi khi xóa nhiệm vụ: " + error.message);
    }
};