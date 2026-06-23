import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AppLogo from './AppLogo';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="glass-panel sticky top-0 z-50 rounded-none border-x-0 border-t-0 px-6 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <AppLogo size="md" />

                {/* Right controls */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                        Xin chào, <span className="font-medium text-slate-700 dark:text-slate-200">{user?.username}</span>
                    </span>

                    <ThemeToggle />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
                        aria-label="Đăng xuất"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:block">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
