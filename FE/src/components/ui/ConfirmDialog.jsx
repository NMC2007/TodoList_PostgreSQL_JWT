import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
    isOpen,
    title = 'Xác nhận xoá',
    message = 'Bạn có chắc muốn xoá nhiệm vụ này? Hành động này không thể hoàn tác.',
    confirmLabel = 'Xoá',
    cancelLabel = 'Huỷ',
    onConfirm,
    onCancel,
}) => {
    // Đóng dialog khi bấm Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onCancel();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Ngăn scroll body khi dialog mở
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className="glass-card w-full max-w-sm mx-4 p-6 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={22} className="text-red-500" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-center mb-2">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="btn-ghost flex-1"
                        autoFocus
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn-danger flex-1"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
