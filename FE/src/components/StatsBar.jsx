import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

const StatsBar = ({ tasks = [], total = 0 }) => {
    const completed = tasks.filter(t => t.status).length;
    const pending = tasks.length - completed;
    const percentage = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    const stats = [
        {
            label: 'Tổng',
            value: total,
            icon: ListTodo,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        },
        {
            label: 'Hoàn thành',
            value: completed,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        },
        {
            label: 'Chưa làm',
            value: pending,
            icon: Circle,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
        },
    ];

    return (
        <div className="glass-panel p-4 space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={16} className={color} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{label}</p>
                            <p className="text-lg font-bold leading-tight">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-slate-500">Tiến độ trang hiện tại</span>
                    <span className="font-medium text-indigo-500">{percentage}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatsBar;
