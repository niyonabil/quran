import { Card, CardHeader, CardContent } from '../components/ui/card';
import { StatCard } from '../components/ui/stat-card';
import { TrendingUp, Users, BookOpen, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const engagementData = [
    { date: '1 Déc', sessions: 120, lectures: 340 },
    { date: '2 Déc', sessions: 150, lectures: 420 },
    { date: '3 Déc', sessions: 180, lectures: 510 },
    { date: '4 Déc', sessions: 140, lectures: 380 },
    { date: '5 Déc', sessions: 200, lectures: 620 },
    { date: '6 Déc', sessions: 190, lectures: 580 },
    { date: '7 Déc', sessions: 220, lectures: 710 },
];

const deviceData = [
    { name: 'Mobile', value: 65, color: '#6366f1' },
    { name: 'Desktop', value: 25, color: '#10b981' },
    { name: 'Tablet', value: 10, color: '#f59e0b' },
];

export function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-2">Statistiques détaillées et métriques d'engagement</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Taux d'Engagement"
                    value="68%"
                    icon={TrendingUp}
                    color="blue"
                    trend={{ value: 5, isPositive: true }}
                />
                <StatCard
                    title="Sessions Journalières"
                    value="220"
                    icon={Users}
                    color="emerald"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="Temps Moyen"
                    value="12min"
                    icon={Clock}
                    color="purple"
                />
                <StatCard
                    title="Pages par Session"
                    value="4.2"
                    icon={BookOpen}
                    color="orange"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">Engagement (7 derniers jours)</h3>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLectures" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Area type="monotone" dataKey="sessions" stroke="#6366f1" fillOpacity={1} fill="url(#colorSessions)" />
                                <Area type="monotone" dataKey="lectures" stroke="#10b981" fillOpacity={1} fill="url(#colorLectures)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Device Distribution */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">Appareils</h3>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            {deviceData.map((device) => (
                                <div key={device.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                                        <span className="text-gray-700">{device.name}</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{device.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
