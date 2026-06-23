import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Chuyển đổi giao diện"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
        >
            <div className="transition-transform duration-300" style={{ transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
        </button>
    );
};

export default ThemeToggle;
