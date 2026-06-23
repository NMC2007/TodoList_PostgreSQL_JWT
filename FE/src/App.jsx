import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Tạm thời placeholder cho Dashboard
const DashboardPlaceholder = () => <div className="p-8 text-center"><h1 className="text-2xl font-bold">Dashboard (Đang xây dựng)</h1></div>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Cấu hình Toast Notification */}
          <Toaster position="top-right" richColors />
          
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPlaceholder />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
