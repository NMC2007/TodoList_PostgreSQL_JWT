import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import AuthCard from '../components/ui/AuthCard';
import FormField from '../components/ui/FormField';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const clearError = (field) => {
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập hoặc email';
        if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({ username, password });
            login(response.data.user, response.data.accessToken, response.data.refreshToken);
            toast.success('Đăng nhập thành công!');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.['Lỗi đăng nhập']
                || error.response?.data?.message
                || 'Đăng nhập thất bại. Vui lòng thử lại.';

            if (errorMessage.includes('Tài khoản hoặc mật khẩu không đúng')) {
                setErrors({ username: errorMessage, password: errorMessage });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <>
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">
                Đăng ký ngay
            </Link>
        </>
    );

    return (
        <AuthCard
            showLogo
            subtitle="Đăng nhập để quản lý công việc của bạn"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <FormField
                    label="Tên đăng nhập / Email"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
                    error={errors.username}
                    placeholder="Nhập tên đăng nhập hoặc email"
                />
                <FormField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                    error={errors.password}
                    placeholder="Nhập mật khẩu"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>
        </AuthCard>
    );
};

export default LoginPage;
