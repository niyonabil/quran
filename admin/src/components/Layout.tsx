import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../lib/store';
import {
    LayoutDashboard,
    Users,
    FileText,
    BarChart3,
    Settings,
    Bell,
    Search,
    Menu,
    LogOut,
    ChevronRight,
    Home
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Utilisateurs', href: '/users', icon: Users },
    { name: 'Contenu', href: '/content', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Système', href: '/system', icon: Settings },
];

export function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, sidebarOpen, toggleSidebar } = useAdminStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get breadcrumb from current path
    const getBreadcrumb = () => {
        const paths = location.pathname.split('/').filter(Boolean);
        return paths.length === 0 ? ['Dashboard'] : paths.map(p =>
            p.charAt(0).toUpperCase() + p.slice(1)
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
                <div className="flex items-center justify-between h-full px-4">
                    {/* Left: Logo + Hamburger */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={20} className="text-gray-600" />
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🕌</span>
                            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                                Admin Panel
                            </h1>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right: Notifications + Profile */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.email || 'Admin'}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={cn(
                'fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-30',
                sidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'
            )}>
                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href ||
                            (item.href !== '/' && location.pathname.startsWith(item.href));

                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    navigate(item.href);
                                    if (isMobile) toggleSidebar();
                                }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                )}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && <span>{item.name}</span>}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className={cn(
                'pt-16 transition-all duration-300',
                sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
            )}>
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Home size={16} className="text-gray-400" />
                        {getBreadcrumb().map((crumb, i, arr) => (
                            <div key={i} className="flex items-center gap-2">
                                <ChevronRight size={16} className="text-gray-400" />
                                <span className={cn(
                                    i === arr.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                )}>
                                    {crumb}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}
