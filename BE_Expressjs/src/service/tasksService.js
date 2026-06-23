import * as taskRepository from "../repository/taskRepository.js";

/**
 * GET ALL - Lấy tất cả nhiệm vụ
 * Xử lý business logic: validate, transform dữ liệu nếu cần
 */
export const getAllTasks = async (userId, filters = {}) => {
    try {
        const parsedFilters = {};

        // Parse status
        if (filters.status !== undefined && filters.status !== "") {
            if (filters.status !== "true" && filters.status !== "false") {
                throw new Error("Status phải là 'true' hoặc 'false'");
            }
            parsedFilters.status = filters.status === "true";
        }

        // Tính dateFrom dựa vào filter
        const filterValue = filters.filter || "all";
        const now = new Date();

        switch (filterValue) {
            case "today": {
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                parsedFilters.dateFrom = start;
                break;
            }
            case "week": {
                const day = now.getDay();
                const diff = day === 0 ? 6 : day - 1; // Thứ 2 = đầu tuần
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
                parsedFilters.dateFrom = start;
                break;
            }
            case "month": {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                parsedFilters.dateFrom = start;
                break;
            }
            case "all":
                break; // Không filter thời gian
            default:
                throw new Error("Filter phải là 'today', 'week', 'month' hoặc 'all'");
        }

        const tasks = await taskRepository.getAllTasks(userId, parsedFilters);
        return tasks;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * GET BY ID - Lấy nhiệm vụ theo ID
 * Validate ID trước khi query database
 */
export const getTaskById = async (id, userId) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error("ID không hợp lệ");
        }
        const task = await taskRepository.getTaskById(id, userId);
        if (!task) {
            throw new Error("Nhiệm vụ không tồn tại");
        }
        return task;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * CREATE - Tạo nhiệm vụ mới
 * Validate dữ liệu đầu vào trước khi lưu
 */
export const createTask = async (title, userId) => {
    try {
        if (!title || title.trim() === "") {
            throw new Error("Tiêu đề không được để trống");
        }
        if (title.length > 255) {
            throw new Error("Tiêu đề không được vượt quá 255 ký tự");
        }
        const task = await taskRepository.createTask(title, userId);
        return task;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * UPDATE - Cập nhật nhiệm vụ
 * Validate ID và dữ liệu, kiểm tra nhiệm vụ tồn tại
 */
export const updateTask = async (id, title, status, userId) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error("ID không hợp lệ");
        }
        // Kiểm tra nhiệm vụ tồn tại
        const existingTask = await taskRepository.getTaskById(id, userId);
        if (!existingTask) {
            throw new Error("Nhiệm vụ không tồn tại");
        }
        // Validate tiêu đề nếu được cập nhật
        if (title && title.trim() === "") {
            throw new Error("Tiêu đề không được để trống");
        }
        if (title && title.length > 255) {
            throw new Error("Tiêu đề không được vượt quá 255 ký tự");
        }
        // Validate status (phải là boolean)
        if (status !== undefined && typeof status !== "boolean") {
            throw new Error("Status phải là boolean (true/false)");
        }

        const task = await taskRepository.updateTask(
            id,
            title || existingTask.title,
            status !== undefined ? status : existingTask.status,
            userId
        );
        return task;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * DELETE - Xóa nhiệm vụ
 * Validate ID và kiểm tra nhiệm vụ tồn tại trước xóa
 */
export const deleteTask = async (id, userId) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error("ID không hợp lệ");
        }
        // Kiểm tra nhiệm vụ tồn tại
        const existingTask = await taskRepository.getTaskById(id, userId);
        if (!existingTask) {
            throw new Error("Nhiệm vụ không tồn tại");
        }
        const task = await taskRepository.deleteTask(id, userId);
        return task;
    } catch (error) {
        throw new Error(error.message);
    }
};