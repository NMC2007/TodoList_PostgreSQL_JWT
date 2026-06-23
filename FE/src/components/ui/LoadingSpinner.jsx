const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
};

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const spinner = (
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-500 ${sizeMap[size]}`} />
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
