import AppLogo from './AppLogo';

const AuthCard = ({ title, subtitle, showLogo = false, footer, children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    {showLogo ? (
                        <>
                            <div className="mb-2">
                                <AppLogo size="lg" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-2">{title}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
                        </>
                    )}
                </div>

                {/* Form Content */}
                {children}

                {/* Footer */}
                {footer && (
                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthCard;
