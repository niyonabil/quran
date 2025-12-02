import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'emerald' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
    return (
        <div className={cn('bg-gradient-to-br p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white', colorClasses[color])}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium opacity-90">{title}</p>
                    <p className="text-4xl font-bold mt-2">{value}</p>
                    {trend && (
                        <div className={cn('text-sm mt-2 flex items-center gap-1', trend.isPositive ? 'text-green-100' : 'text-red-100')}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
                <div className="text-5xl opacity-30">
                    <Icon size={48} />
                </div>
            </div>
        </div>
    );
}
