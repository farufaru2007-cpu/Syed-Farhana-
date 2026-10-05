import React from 'react';
import { formatRupee } from '../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardCardsProps {
  moneyAvailable: number;
  totalIncome: number;
  totalSpent: number;
  moneySaved: number;
  savingsRate: number;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  moneyAvailable,
  totalIncome,
  totalSpent,
  moneySaved,
  savingsRate,
}) => {
  const isHealthy = moneyAvailable >= 0;

  return (
    <section className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: 💰 Money Available */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>💰</span> Money Available
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isHealthy ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1">
            <div className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${isHealthy ? 'text-slate-900' : 'text-rose-600'}`}>
              {formatRupee(moneyAvailable)}
            </div>
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>{isHealthy ? 'Current balance in pocket' : 'Warning: Kharcha exceeded income!'}</span>
            </p>
          </div>
        </div>

        {/* Card 2: 💵 Total Income */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>💵</span> Total Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-600">
              {formatRupee(totalIncome)}
            </div>
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              <span>Salary, pocket money & gigs</span>
            </p>
          </div>
        </div>

        {/* Card 3: 💸 Total Spent */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>💸</span> Total Spent
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-rose-600">
              {formatRupee(totalSpent)}
            </div>
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
              <span>UPI, cash & bills spent</span>
            </p>
          </div>
        </div>

        {/* Card 4: 🏦 Money Saved */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏦</span> Money Saved
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-indigo-600">
              {formatRupee(moneySaved)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Savings Rate:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                savingsRate >= 30
                  ? 'bg-emerald-100 text-emerald-800'
                  : savingsRate >= 10
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {savingsRate}% saved
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
