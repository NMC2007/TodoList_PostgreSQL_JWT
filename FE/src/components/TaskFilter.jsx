const TIME_FILTERS = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Hôm nay', value: 'today' },
    { label: 'Tuần này', value: 'week' },
    { label: 'Tháng này', value: 'month' },
];

const STATUS_FILTERS = [
    { label: 'Tất cả', value: '' },
    { label: 'Hoàn thành', value: 'true' },
    { label: 'Chưa làm', value: 'false' },
];

const TaskFilter = ({ filters, onChange }) => {
    const setFilter = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Time filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {TIME_FILTERS.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setFilter('filter', value)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            filters.filter === value
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {STATUS_FILTERS.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setFilter('status', value)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            filters.status === value
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TaskFilter;
