import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { authService } from '../services/authService';
import { toast } from 'sonner';

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        let newErrors = {};
        
        // Client validation
        if (!formData.username.trim()) {
            newErrors.username = "Vui lòng nhập tên đăng nhập";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập địa chỉ email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không đúng định dạng";
        }
        
        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        } else if (/\s/.test(formData.password)) {
            newErrors.password = "Mật khẩu không được chứa dấu cách";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
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
            
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.["Lỗi đăng ký"] || 
                                 error.response?.data?.message || 
                                 "Đăng ký thất bại. Vui lòng thử lại.";
            
            // Map backend errors to specific fields
            if (errorMessage.toLowerCase().includes("email")) {
                setErrors({ email: errorMessage });
            } else if (errorMessage.toLowerCase().includes("mật khẩu")) {
                setErrors({ password: errorMessage });
            } else if (errorMessage.toLowerCase().includes("tên đăng nhập")) {
                setErrors({ username: errorMessage });
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
                    <h2 className="text-2xl font-bold mb-2">Tạo tài khoản mới</h2>
                    <p className="text-slate-500 dark:text-slate-400">Tham gia TaskFlow ngay hôm nay</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`input-field ${errors.username ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                            placeholder="Tên đăng nhập (viết liền, không dấu)"
                            required
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1.5">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                            placeholder="Địa chỉ email"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                            placeholder="Mật khẩu (ít nhất 6 ký tự)"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`input-field ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-4"
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Đã có tài khoản? </span>
                    <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
