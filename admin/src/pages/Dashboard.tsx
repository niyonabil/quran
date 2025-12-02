import { useState, useEffect } from 'react';
import { adminUsersApi } from '../lib/api';
import { StatCard } from '../components/ui/stat-card';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Users, Star, BookOpen, Clock, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatDateTime } from '../lib/utils';

// Mock data for charts
const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Fév', users: 580 },
    { month: 'Mar', users: 720 },
    { month: 'Avr', users: 890 },
    { month: 'Mai', users: 1200 },
    { month: 'Juin', users: 1450 },
];

const readingData = [
    { surah: 'Al-Fatiha', reads: 3400 },
    { surah: 'Al-Baqarah', reads: 2800 },
    { surah: 'Al-Imran', reads: 2100 },
    { surah: 'An-Nisa', reads: 1650 },
    { surah: 'Al-Maidah', reads: 1420 },
];

export function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            adminUsersApi.getStats().then(({ data }: any) => {
                setStats(data);
            }).catch(err => {
                console.error('Stats error:', err);
                // Use mock data if API fails
                setStats({
                    totalUsers: 1450,
                    totalFavorites: 3240,
                    totalReadingHistory: 8920,
                    activeUsers: 892,
                });
            }),
        ]).finally(() => setLoading(false));

        // Mock recent activity
        setRecentActivity([
            { user: 'user@example.com', action: 'Nouveau compte créé', time: new Date() },
            { user: 'admin@example.com', action: 'Adhan uploaded', time: new Date(Date.now() - 300000) },
            { user: 'user2@example.com', action: 'Surah favorisée', time: new Date(Date.now() - 600000) },
        ]);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🕌</div>
                    <p className="text-gray-600">Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
                <p className="text-gray-600 mt-2">Vue d'ensemble de votre plateforme Quran</p>
            </div>

            {/* KPI Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Utilisateurs Totaux"
                        value={formatNumber(stats.totalUsers)}
                        icon={Users}
                        color="blue"
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="Favoris"
                        value={formatNumber(stats.totalFavorites)}
                        icon={Star}
                        color="emerald"
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatCard
                        title="Lectures"
                        value={formatNumber(stats.totalReadingHistory)}
                        icon={BookOpen}
                        color="purple"
                        trend={{ value: 15, isPositive: true }}
                    />
                    <StatCard
                        title="Utilisateurs Actifs"
                        value={formatNumber(stats.activeUsers || Math.floor(stats.totalUsers * 0.6))}
                        icon={Activity}
                        color="orange"
                        trend={{ value: 3, isPositive: false }}
                    />
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-indigo-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">Croissance des Utilisateurs</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Reading Stats Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BookOpen className="text-emerald-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">Surahs les Plus Lues</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={readingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="surah" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="reads" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="text-purple-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
                        </div>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Voir tout
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold">
                                            {activity.user.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                        <p className="text-sm text-gray-600">{activity.action}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{formatDateTime(activity.time)}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
