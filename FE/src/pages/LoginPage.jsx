import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'sonner';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        let newErrors = {};
        if (!username.trim()) {
            newErrors.username = "Vui lòng nhập tên đăng nhập hoặc email";
        }
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login({ username, password });
            login(response.data.user, response.data.accessToken, response.data.refreshToken);
            toast.success("Đăng nhập thành công!");
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.["Lỗi đăng nhập"] || 
                                 error.response?.data?.message || 
                                 "Đăng nhập thất bại. Vui lòng thử lại.";
            
            if (errorMessage.includes("Tài khoản hoặc mật khẩu không đúng")) {
                setErrors({ username: errorMessage, password: errorMessage });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        TaskFlow
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Đăng nhập để quản lý công việc của bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                        <label className="block text-sm font-medium mb-2">Tên đăng nhập / Email</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (errors.username) setErrors({ ...errors, username: null });
                            }}
                            className={`input-field ${errors.username ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                            placeholder="Nhập tên đăng nhập hoặc email"
                            required
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1.5">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: null });
                            }}
                            className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
