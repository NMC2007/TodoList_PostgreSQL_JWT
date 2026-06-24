import { ClipboardList } from 'lucide-react';

const EmptyState = ({ message = 'Chưa có nhiệm vụ nào', subMessage = 'Hãy thêm nhiệm vụ đầu tiên của bạn ở phía trên' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-indigo-400 dark:text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {message}
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center max-w-xs">
                {subMessage}
            </p>
        </div>
    );
};

export default EmptyState;
