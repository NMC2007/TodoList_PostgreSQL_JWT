import { useState, useRef } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const TaskForm = ({ onSubmit, isSubmitting = false }) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed || isSubmitting) return;

        await onSubmit(trimmed);
        setTitle('');
        inputRef.current?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-2 flex items-center gap-2">
            <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Thêm nhiệm vụ mới..."
                maxLength={255}
                className="input-field border-none bg-transparent focus:shadow-none flex-1"
            />
            <button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="btn-primary px-3 py-2.5 rounded-lg flex-shrink-0"
                aria-label="Thêm nhiệm vụ"
            >
                {isSubmitting
                    ? <Loader2 size={18} className="animate-spin" />
                    : <Plus size={18} />
                }
            </button>
        </form>
    );
};

export default TaskForm;
