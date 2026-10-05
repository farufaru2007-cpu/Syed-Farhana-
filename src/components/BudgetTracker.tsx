import React, { useState } from 'react';
import { formatRupee } from '../utils/formatters';
import { Target, AlertTriangle, CheckCircle2, Sliders, Calendar } from 'lucide-react';

interface BudgetTrackerProps {
  monthlyBudget: number;
  totalSpent: number;
  onUpdateBudget: (newBudget: number) => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  monthlyBudget,
  totalSpent,
  onUpdateBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetValue, setBudgetValue] = useState(monthlyBudget.toString());

  // Calculate days remaining in current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, lastDay - currentDay + 1);

  const spentPercentage = Math.min(100, Math.round((totalSpent / (monthlyBudget || 1)) * 100));
  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
  const dailySafeSpend = Math.max(0, Math.round(remainingBudget / daysRemaining));

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetValue);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50/50 via-amber-50/40 to-emerald-50/50 rounded-2xl border border-orange-200/70 p-5 sm:p-6 mb-6 sm:mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Monthly Budget & Daily Safe-to-Spend Limit
            </h3>
            <p className="text-xs text-slate-500">
              Helps Indian students & freshers not run out of pocket money before month end
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setBudgetValue(monthlyBudget.toString());
            setIsEditing(!isEditing);
          }}
          className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-orange-800 bg-white border border-orange-200 hover:bg-orange-50 rounded-xl transition-colors shadow-xs"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel' : 'Change Budget'}</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSaveBudget} className="mb-4 p-3 bg-white rounded-xl border border-orange-200 flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-slate-700">Set Monthly Target (₹):</label>
          <input
            type="number"
            min="500"
            step="100"
            value={budgetValue}
            onChange={(e) => setBudgetValue(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-36"
            placeholder="e.g. 10000"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
          >
            Save Target
          </button>
        </form>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700">
          <span>Spent {formatRupee(totalSpent)} of {formatRupee(monthlyBudget)}</span>
          <span className={spentPercentage > 90 ? 'text-rose-600' : 'text-slate-600'}>
            {spentPercentage}% used
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              spentPercentage > 90
                ? 'bg-rose-500'
                : spentPercentage > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${spentPercentage}%` }}
          />
        </div>
      </div>

      {/* Safe Daily Spend Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-orange-200/50">
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-500">Days Remaining:</span>{' '}
            <span className="font-bold text-slate-800">{daysRemaining} days</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="text-xs">
            <span className="text-slate-500">Budget Remaining:</span>{' '}
            <span className={`font-bold ${remainingBudget === 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {formatRupee(remainingBudget)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 bg-white/80 px-3 py-1.5 rounded-lg border border-orange-200/60">
          {spentPercentage > 100 ? (
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <div className="text-xs">
            <span className="text-slate-500">Safe Daily Limit:</span>{' '}
            <span className="font-extrabold text-orange-600">
              {formatRupee(dailySafeSpend)} / day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
