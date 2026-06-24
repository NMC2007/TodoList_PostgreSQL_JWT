/**
 * Task Service — Gọi API CRUD cho nhiệm vụ
 * Nhận `api` (axios instance từ useAxios) làm tham số đầu tiên
 * để đảm bảo token được attach tự động qua interceptor.
 */

const taskService = {
    /**
     * Lấy danh sách tasks có phân trang + filter
     * @param {object} params - { filter, status, page, limit }
     */
    getAll: async (api, params = {}) => {
        const response = await api.get('/tasks', { params });
        return response.data;
    },

    /**
     * Tạo task mới
     * @param {string} title - Tiêu đề nhiệm vụ
     */
    create: async (api, title) => {
        const response = await api.post('/tasks', { title });
        return response.data;
    },

    /**
     * Cập nhật task (title và/hoặc status)
     * @param {number} id - ID nhiệm vụ
     * @param {object} data - { title?, status? }
     */
    update: async (api, id, data) => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },

    /**
     * Xoá task
     * @param {number} id - ID nhiệm vụ
     */
    delete: async (api, id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
};

export default taskService;
