import { Link } from 'react-router';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center animate-slide-up">
                <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-semibold mb-4">Trang không tìm thấy</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Có vẻ như bạn đã đi lạc. Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link to="/" className="btn-primary">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
