import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from '../hooks/useAxios';
import taskService from '../services/taskService';

// Layout
import Navbar from '../components/ui/Navbar';

// Components
import StatsBar from '../components/StatsBar';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import TaskCard from '../components/TaskCard';
import Pagination from '../components/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ITEMS_PER_PAGE = 10;

const DashboardPage = () => {
    const api = useAxios();

    // State
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filters, setFilters] = useState({ filter: 'all', status: '' });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: ITEMS_PER_PAGE,
        total: 0,
        totalPages: 0,
    });
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ──────────────────────────────────────────────
    // Fetch tasks từ API
    // ──────────────────────────────────────────────
    const fetchTasks = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await taskService.getAll(api, {
                filter: filters.filter,
                status: filters.status,
                page,
                limit: ITEMS_PER_PAGE,
            });
            setTasks(response.data.tasks);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Không thể tải danh sách nhiệm vụ');
            console.error('Fetch tasks error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [api, filters]);

    // Fetch khi mount hoặc khi filters thay đổi (reset page về 1)
    useEffect(() => {
        fetchTasks(1);
    }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

    // ──────────────────────────────────────────────
    // Handlers
    // ──────────────────────────────────────────────

    /** Thêm task mới */
    const handleCreateTask = async (title) => {
        setIsSubmitting(true);
        try {
            await taskService.create(api, title);
            toast.success('Đã thêm nhiệm vụ mới');
            // Re-fetch trang hiện tại để cập nhật danh sách + pagination
            await fetchTasks(pagination.page);
        } catch (error) {
            const msg = error.response?.data?.errors?.['Lỗi tạo']
                || error.response?.data?.message
                || 'Không thể thêm nhiệm vụ';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    /** Toggle trạng thái task */
    const handleToggleTask = async (id, newStatus) => {
        // Lưu lại task cũ để revert nếu cần
        const oldTask = tasks.find(t => t.id === id);
        
        // Optimistic update
        setTasks(prev =>
            prev.map(t => t.id === id ? { 
                ...t, 
                status: newStatus,
                completed_at: newStatus ? new Date().toISOString() : null
            } : t)
        );
        try {
            await taskService.update(api, id, { status: newStatus });
        } catch (error) {
            // Revert nếu lỗi
            setTasks(prev =>
                prev.map(t => t.id === id ? { ...t, status: !newStatus, completed_at: oldTask?.completed_at } : t)
            );
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    /** Sửa title task (inline edit) */
    const handleUpdateTask = async (id, newTitle) => {
        // Optimistic update
        const oldTask = tasks.find(t => t.id === id);
        setTasks(prev =>
            prev.map(t => t.id === id ? { ...t, title: newTitle } : t)
        );
        try {
            await taskService.update(api, id, { title: newTitle });
            toast.success('Đã cập nhật nhiệm vụ');
        } catch (error) {
            // Revert nếu lỗi
            setTasks(prev =>
                prev.map(t => t.id === id ? { ...t, title: oldTask.title } : t)
            );
            toast.error('Không thể cập nhật nhiệm vụ');
        }
    };

    /** Xoá task — bước 1: mở dialog xác nhận */
    const handleDeleteClick = (id) => {
        setDeleteTarget(id);
    };

    /** Xoá task — bước 2: xác nhận xoá */
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await taskService.delete(api, deleteTarget);
            toast.success('Đã xoá nhiệm vụ');
            setDeleteTarget(null);
            // Re-fetch — nếu trang hiện tại trống thì lùi về trang trước
            const newPage = tasks.length === 1 && pagination.page > 1
                ? pagination.page - 1
                : pagination.page;
            await fetchTasks(newPage);
        } catch (error) {
            toast.error('Không thể xoá nhiệm vụ');
        }
    };

    /** Đổi trang */
    const handlePageChange = (newPage) => {
        fetchTasks(newPage);
        // Scroll lên đầu danh sách
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /** Đổi filter */
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        // fetchTasks(1) sẽ được gọi tự động qua useEffect
    };

    // ──────────────────────────────────────────────
    // Render
    // ──────────────────────────────────────────────
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 max-w-3xl w-full mx-auto px-4 py-6 gap-5 animate-slide-up">
                {/* Stats */}
                <StatsBar tasks={tasks} total={pagination.total} />

                {/* Form thêm task */}
                <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />

                {/* Filter */}
                <TaskFilter filters={filters} onChange={handleFilterChange} />

                {/* Pagination */}
                {!isLoading && tasks.length > 0 && (
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        total={pagination.total}
                        limit={pagination.limit}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* Task list — scrollable area */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1">
                    {isLoading ? (
                        <div className="py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : tasks.length === 0 ? (
                        <EmptyState
                            message={
                                filters.status === 'true'
                                    ? 'Chưa có nhiệm vụ hoàn thành'
                                    : filters.status === 'false'
                                        ? 'Tất cả nhiệm vụ đã hoàn thành!'
                                        : 'Chưa có nhiệm vụ nào'
                            }
                            subMessage={
                                filters.status === 'true'
                                    ? 'Hãy bắt đầu hoàn thành nhiệm vụ nào'
                                    : filters.status === 'false'
                                        ? 'Bạn đã hoàn thành hết rồi, tuyệt vời!'
                                        : 'Hãy thêm nhiệm vụ đầu tiên của bạn ở phía trên'
                            }
                        />
                    ) : (
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggleTask}
                                    onUpdate={handleUpdateTask}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Confirm delete dialog */}
            <ConfirmDialog
                isOpen={deleteTarget !== null}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default DashboardPage;
