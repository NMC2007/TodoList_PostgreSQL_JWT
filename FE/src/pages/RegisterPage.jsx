import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import AuthCard from '../components/ui/AuthCard';
import FormField from '../components/ui/FormField';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập địa chỉ email';
        } else if (!EMAIL_REGEX.test(formData.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        } else if (/\s/.test(formData.password)) {
            newErrors.password = 'Mật khẩu không được chứa dấu cách';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await authService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.['Lỗi đăng ký']
                || error.response?.data?.message
                || 'Đăng ký thất bại. Vui lòng thử lại.';

            if (errorMessage.toLowerCase().includes('email')) {
                setErrors({ email: errorMessage });
            } else if (errorMessage.toLowerCase().includes('mật khẩu')) {
                setErrors({ password: errorMessage });
            } else if (errorMessage.toLowerCase().includes('tên đăng nhập')) {
                setErrors({ username: errorMessage });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <>
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">
                Đăng nhập
            </Link>
        </>
    );

    return (
        <AuthCard
            title="Tạo tài khoản mới"
            subtitle="Tham gia TaskFlow ngay hôm nay"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <FormField
                    label="Tên đăng nhập"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="Tên đăng nhập (viết liền, không dấu)"
                />
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Địa chỉ email"
                />
                <FormField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Mật khẩu (ít nhất 6 ký tự)"
                />
                <FormField
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Nhập lại mật khẩu"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 mt-2"
                >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
            </form>
        </AuthCard>
    );
};

export default RegisterPage;
