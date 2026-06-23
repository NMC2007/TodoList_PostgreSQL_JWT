const sizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
};

const AppLogo = ({ size = 'lg' }) => {
    return (
        <span className={`font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent ${sizeMap[size]}`}>
            TaskFlow
        </span>
    );
};

export default AppLogo;
