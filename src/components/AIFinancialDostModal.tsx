import React, { useState } from 'react';
import { X, Bot, Sparkles, AlertCircle, Loader2, Lightbulb, TrendingUp, ShieldCheck, Quote } from 'lucide-react';
import { AIFinancialAdvice, Transaction } from '../types';
import { formatRupee } from '../utils/formatters';

interface AIFinancialDostModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalIncome: number;
  totalSpent: number;
  moneyAvailable: number;
  savingsRate: number;
  monthlyBudget: number;
  transactions: Transaction[];
}

export const AIFinancialDostModal: React.FC<AIFinancialDostModalProps> = ({
  isOpen,
  onClose,
  totalIncome,
  totalSpent,
  moneyAvailable,
  savingsRate,
  monthlyBudget,
  transactions,
}) => {
  const [persona, setPersona] = useState<'student' | 'fresher' | 'general'>('student');
  const [advice, setAdvice] = useState<AIFinancialAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateAdvice = async () => {
    setIsLoading(true);
    setError(null);

    // Calculate category breakdown
    const categoryTotals: Record<string, number> = {};
    const paymentTotals: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        paymentTotals[tx.paymentMethod] = (paymentTotals[tx.paymentMethod] || 0) + tx.amount;
      }
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
      pct: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }));

    const paymentMethodBreakdown = Object.entries(paymentTotals).map(([name, amount]) => ({
      name,
      amount,
    }));

    try {
      const response = await fetch('/api/ai/financial-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalIncome,
          totalSpent,
          moneyAvailable,
          savingsRate,
          monthlyBudget,
          categoryBreakdown,
          paymentMethodBreakdown,
          recentTransactions: transactions.slice(0, 8),
          userPersona: persona === 'student' ? 'College Student with Pocket Money' : persona === 'fresher' ? 'Young Working Professional / Fresher' : 'General Indian User',
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to get financial advice');
      }

      setAdvice(resData.data);
    } catch (err: any) {
      console.error('Advice error:', err);
      setError(err?.message || 'Could not fetch AI Dost advice. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                AI Financial Dost
                <span className="text-[11px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  India Mentor
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Warm, no-jargon financial advice for your daily expenses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Persona Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Profile:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPersona('student')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  persona === 'student'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                🎓 College Student
              </button>
              <button
                type="button"
                onClick={() => setPersona('fresher')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  persona === 'fresher'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                💼 Young Professional
              </button>
              <button
                type="button"
                onClick={() => setPersona('general')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  persona === 'general'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏠 General User
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Available</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">{formatRupee(moneyAvailable)}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Spent</span>
              <p className="text-sm sm:text-base font-extrabold text-rose-600">{formatRupee(totalSpent)}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Saved</span>
              <p className="text-sm sm:text-base font-extrabold text-emerald-600">{savingsRate}%</p>
            </div>
          </div>

          {/* Get Advice Button */}
          {!advice && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGenerateAdvice}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 hover:opacity-95 shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Dost is analyzing your expenses...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze My Expenses & Give Advice</span>
                </>
              )}
            </button>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Advice Output */}
          {advice && (
            <div className="space-y-4 animate-fade-in">
              {/* Verdict Header */}
              <div className={`p-4 rounded-2xl border ${
                advice.status === 'great'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : advice.status === 'caution'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}>
                <h3 className="text-base font-extrabold leading-tight">
                  {advice.headline}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 border border-current text-xs font-bold shadow-xs">
                  <span>Safe Daily Spend:</span>
                  <span className="text-indigo-600">{advice.dailySafeSpend}</span>
                </div>
              </div>

              {/* Top Insight */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>AI Spending Analysis</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {advice.topInsight}
                </p>
              </div>

              {/* Actionable Tips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Practical Indian Money Hacks:
                </span>
                <div className="space-y-2">
                  {advice.actionableTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start space-x-2.5 text-xs sm:text-sm text-slate-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="p-3.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/60 flex items-start space-x-2.5">
                <Quote className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs italic text-orange-950 font-medium">
                  "{advice.motivationalQuote}"
                </p>
              </div>

              {/* Refresh Advice Button */}
              <button
                type="button"
                onClick={handleGenerateAdvice}
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all"
              >
                {isLoading ? 'Re-analyzing...' : 'Refresh Advice with Latest Transactions'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
