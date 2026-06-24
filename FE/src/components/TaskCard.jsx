import { useState, useRef, useEffect } from 'react';
import { Trash2, Check, Pencil } from 'lucide-react';

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const TaskCard = ({ task, onToggle, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing) inputRef.current?.focus();
    }, [isEditing]);

    const handleStartEdit = () => {
        setEditValue(task.title);
        setIsEditing(true);
    };

    const handleConfirmEdit = () => {
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== task.title) {
            onUpdate(task.id, trimmed);
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditValue(task.title);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleConfirmEdit();
        if (e.key === 'Escape') handleCancelEdit();
    };

    return (
        <div className={`group glass-panel px-4 py-3.5 flex items-center gap-3 transition-all duration-200 ${task.status ? 'opacity-60' : ''}`}>
            {/* Checkbox */}
            <button
                onClick={() => onToggle(task.id, !task.status)}
                aria-label={task.status ? 'Đánh dấu chưa làm' : 'Đánh dấu hoàn thành'}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    task.status
                        ? 'bg-indigo-500 border-indigo-500'
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                }`}
            >
                {task.status && <Check size={11} strokeWidth={3} className="text-white" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleConfirmEdit}
                        className="input-field py-1 text-sm w-full"
                    />
                ) : (
                    <p
                        onDoubleClick={handleStartEdit}
                        title="Double-click để chỉnh sửa"
                        className={`text-sm leading-relaxed cursor-text select-none ${
                            task.status ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'
                        }`}
                    >
                        {task.title}
                    </p>
                )}

                {/* Dates */}
                <div className="flex flex-wrap gap-x-3 mt-1">
                    {task.created_at && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            Tạo: {formatDate(task.created_at)}
                        </span>
                    )}
                    {task.completed_at && (
                        <span className="text-xs text-emerald-500">
                            Hoàn thành: {formatDate(task.completed_at)}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {!isEditing && (
                    <button
                        onClick={handleStartEdit}
                        aria-label="Chỉnh sửa"
                        className="p-1.5 rounded-md text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                        <Pencil size={14} />
                    </button>
                )}
                <button
                    onClick={() => onDelete(task.id)}
                    aria-label="Xóa"
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
