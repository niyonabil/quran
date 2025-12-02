import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/Login';
import { UsersPage } from './pages/UsersPage';
import { ContentPage } from './pages/ContentPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SystemPage } from './pages/SystemPage';
import { Layout } from './components/Layout';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('admin_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'content', element: <ContentPage /> },
            { path: 'analytics', element: <AnalyticsPage /> },
            { path: 'system', element: <SystemPage /> },
        ],
    },
    { path: '/login', element: <LoginPage /> },
]);
