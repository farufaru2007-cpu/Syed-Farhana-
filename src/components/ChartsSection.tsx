import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatRupee } from '../utils/formatters';
import { PieChart, BarChart3, CreditCard, Layers } from 'lucide-react';

interface ChartsSectionProps {
  transactions: Transaction[];
  totalSpent: number;
}

const PALETTE = [
  '#f97316', // orange
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#eab308', // yellow
  '#3b82f6', // blue
  '#f43f5e', // rose
  '#14b8a6', // teal
  '#64748b', // slate
];

export const ChartsSection: React.FC<ChartsSectionProps> = ({ transactions, totalSpent }) => {
  const [activeTab, setActiveTab] = useState<'category' | 'method' | 'trend'>('category');

  // Compute expenses by category
  const categoryMap: Record<string, number> = {};
  const methodMap: Record<string, number> = {};
  const dayMap: Record<string, number> = {};

  const expenses = transactions.filter((t) => t.type === 'expense');

  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    methodMap[t.paymentMethod] = (methodMap[t.paymentMethod] || 0) + t.amount;
    dayMap[t.date] = (dayMap[t.date] || 0) + t.amount;
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, amount], idx) => ({
      name,
      amount,
      pct: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
      color: PALETTE[idx % PALETTE.length],
    }))
    .sort((a, b) => b.amount - a.amount);

  const methodData = Object.entries(methodMap)
    .map(([name, amount], idx) => ({
      name,
      amount,
      pct: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
      color: PALETTE[(idx + 3) % PALETTE.length],
    }))
    .sort((a, b) => b.amount - a.amount);

  // Recent 7 days for trend
  const sortedDays = Object.keys(dayMap).sort().slice(-7);
  const trendData = sortedDays.map((date) => ({
    date,
    amount: dayMap[date] || 0,
    formattedDate: new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    }),
  }));
  const maxDayAmount = Math.max(...trendData.map((d) => d.amount), 1);

  // SVG Donut calculation
  let cumulativeAngle = 0;
  const donutSlices = categoryData.map((item) => {
    const angle = (item.amount / (totalSpent || 1)) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return { ...item, startAngle, angle };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 mb-6 sm:mb-8 shadow-sm">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-600" />
            <span>Visual Analytics & Spending Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500">
            See where your money actually goes each month
          </p>
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('category')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'category'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Category Share
          </button>
          <button
            onClick={() => setActiveTab('method')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'method'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            UPI vs Cash
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'trend'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Trend
          </button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No expenses recorded yet. Add your first expense to see charts!
        </div>
      ) : activeTab === 'category' ? (
        /* Category Share */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Donut Chart representation */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                {donutSlices.map((slice, i) => {
                  const strokeDasharray = `${(slice.angle / 360) * 251.2} 251.2`;
                  const strokeDashoffset = -((slice.startAngle / 360) * 251.2);
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 hover:opacity-80"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Spent</span>
                <span className="text-lg sm:text-xl font-black text-slate-900">{formatRupee(totalSpent)}</span>
              </div>
            </div>
          </div>

          {/* Category List with Bars */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {categoryData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-800 truncate">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0 space-x-2">
                    <span className="text-slate-900 font-bold">{formatRupee(item.amount)}</span>
                    <span className="text-slate-400 font-normal">({item.pct}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'method' ? (
        /* Payment Method Share (UPI vs Cash etc.) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {methodData.map((method) => (
            <div
              key={method.name}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  {method.name}
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {method.pct}%
                </span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {formatRupee(method.amount)}
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${method.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Daily Trend Bar Chart */
        <div className="space-y-4">
          <div className="h-52 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 overflow-x-auto">
            {trendData.map((day) => {
              const heightPct = Math.max(10, Math.round((day.amount / maxDayAmount) * 100));
              return (
                <div key={day.date} className="flex-1 min-w-[50px] flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatRupee(day.amount)}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-36 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-orange-500 to-amber-400 group-hover:from-orange-600 group-hover:to-amber-500 transition-all rounded-t-lg"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 text-center truncate w-full">
                    {day.formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-400">
            Hover over bars to view exact spend for each day
          </p>
        </div>
      )}
    </div>
  );
};
