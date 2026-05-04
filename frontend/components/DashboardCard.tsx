import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
