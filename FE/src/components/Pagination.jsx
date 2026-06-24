import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Tính danh sách số trang cần hiển thị (có truncation "...")
 * VD: totalPages=20, currentPage=10 → [1, '...', 9, 10, 11, '...', 20]
 */
const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const showStart = currentPage > 4;
    const showEnd = currentPage < totalPages - 3;

    pages.push(1);

    if (showStart) {
        pages.push('...');
    }

    const rangeStart = showStart ? Math.max(currentPage - 1, 2) : 2;
    const rangeEnd = showEnd ? Math.min(currentPage + 1, totalPages - 1) : totalPages - 1;

    for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
    }

    if (showEnd) {
        pages.push('...');
    }

    pages.push(totalPages);

    return pages;
};

const Pagination = ({ page, totalPages, total, limit, onPageChange }) => {
    if (totalPages <= 1) return null;

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);
    const pageNumbers = getPageNumbers(page, totalPages);

    const baseBtnClass = 'w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-200';

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Info */}
            <p className="text-xs text-slate-400 dark:text-slate-500 order-2 sm:order-1">
                Hiển thị {startItem}–{endItem} trên {total} nhiệm vụ
            </p>

            {/* Page buttons */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                {/* Previous */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className={`${baseBtnClass} text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                    aria-label="Trang trước"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                {pageNumbers.map((p, idx) =>
                    p === '...' ? (
                        <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-xs text-slate-400">
                            ···
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`${baseBtnClass} ${
                                p === page
                                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className={`${baseBtnClass} text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                    aria-label="Trang sau"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
