import * as taskService from "../service/tasksService.js";
import { toAPIResponse } from "../models/dto/APIResponse.js";

/**
 * GET ALL - Lấy tất cả nhiệm vụ
 */
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(
            toAPIResponse(200, "Lấy các nhiệm vụ thành công", tasks)
        );
    } catch (error) {
        res.status(500).json(
            toAPIResponse(500, "Lỗi khi lấy các nhiệm vụ", null, { "Lỗi server": error.message })
        );
    }
};

/**
 * GET BY ID - Lấy nhiệm vụ theo ID
 */
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.getTaskById(id);
        res.status(200).json(
            toAPIResponse(200, "Lấy nhiệm vụ thành công", task)
        );
    } catch (error) {
        res.status(404).json(
            toAPIResponse(404, "Lỗi khi lấy nhiệm vụ", null, { "Không tìm thấy": error.message })
        );
    }
};

/**
 * CREATE - Tạo nhiệm vụ mới
 */
export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = await taskService.createTask(title);
        res.status(201).json(
            toAPIResponse(201, "Tạo nhiệm vụ thành công", task)
        );
    } catch (error) {
        res.status(400).json(
            toAPIResponse(400, "Lỗi khi tạo nhiệm vụ", null, { "Lỗi tạo": error.message })
        );
    }
};

/**
 * UPDATE - Cập nhật nhiệm vụ
 */
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;
        const task = await taskService.updateTask(id, title, status);
        res.status(200).json(
            toAPIResponse(200, "Cập nhật nhiệm vụ thành công", task)
        );
    } catch (error) {
        res.status(400).json(
            toAPIResponse(400, "Lỗi khi cập nhật nhiệm vụ", null, { "Lỗi cập nhật": error.message })
        );
    }
};

/**
 * DELETE - Xóa nhiệm vụ
 */
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.deleteTask(id);
        res.status(200).json(
            toAPIResponse(200, "Xóa nhiệm vụ thành công", task)
        );
    } catch (error) {
        res.status(400).json(
            toAPIResponse(400, "Lỗi khi xóa nhiệm vụ", null, { "Lỗi xóa": error.message })
        );
    }
};