import React, { useState } from 'react';
import { Transaction, PaymentMethod } from '../types';
import { formatRupee, formatIndianDate } from '../utils/formatters';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  CreditCard,
  IndianRupee,
  FileSpreadsheet,
  X,
} from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onClearAll: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onDeleteTransaction,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering logic
  const filtered = transactions.filter((t) => {
    // Search match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchNote = t.note?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchNote) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;

    // Category filter
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    // Method filter
    if (methodFilter !== 'all' && t.paymentMethod !== methodFilter) return false;

    // Date filter
    if (dateFilter === 'today') {
      if (t.date !== todayStr) return false;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      if (t.date < weekAgoStr) return false;
    } else if (dateFilter === 'month') {
      const monthPrefix = todayStr.slice(0, 7); // YYYY-MM
      if (!t.date.startsWith(monthPrefix)) return false;
    }

    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Amount (INR)', 'Category', 'Payment Method', 'Title', 'Note'];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.type,
      t.amount,
      `"${t.category.replace(/"/g, '""')}"`,
      t.paymentMethod,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expense_Statement_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMethodBadgeClass = (method: PaymentMethod) => {
    switch (method) {
      case 'UPI':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cash':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Credit Card':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Debit Card':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Bank Transfer':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Net Banking':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Transaction History</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
              {filtered.length} entries
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Search, filter by UPI/Cash, and export your statement
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          {/* Clear All */}
          {transactions.length > 0 && (
            showConfirmClear ? (
              <div className="inline-flex items-center space-x-1.5 p-1 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="text-xs text-rose-700 font-semibold px-2">Clear all slots?</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setShowConfirmClear(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-6">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Swiggy, Chai, Metro, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="expense">💸 Expenses Only</option>
            <option value="income">💵 Income Only</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-slate-700"
          >
            <option value="all">All Payment Modes</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.name} value={pm.name}>
                {pm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe Filter */}
        <div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-slate-700"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="text-center py-14 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <span className="text-2xl mb-2 block">📝</span>
          <p className="text-slate-700 text-sm font-bold">Your ledger is completely blank and ready!</p>
          <p className="text-slate-400 text-xs mt-1">Fill in the blank slots above to add your first daily expense or income.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 text-sm font-medium">No transactions match your search or filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setCategoryFilter('all');
              setMethodFilter('all');
              setDateFilter('all');
            }}
            className="mt-2 text-xs text-orange-600 hover:text-orange-700 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all shadow-xs group"
            >
              {/* Left Details */}
              <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
                {/* Emoji Icon Badge */}
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 ${
                  item.type === 'expense' ? 'bg-orange-50 border border-orange-100' : 'bg-emerald-50 border border-emerald-100'
                }`}>
                  {item.category.slice(0, 2) || (item.type === 'expense' ? '💸' : '💵')}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    {/* Payment Mode Badge */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold border ${getMethodBadgeClass(item.paymentMethod)}`}>
                      {item.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                    <span>{item.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{formatIndianDate(item.date)}</span>
                    {item.note && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline"></span>
                        <span className="text-slate-400 italic truncate max-w-[180px] hidden sm:inline">
                          {item.note}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Amount & Delete */}
              <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
                <div className="text-right">
                  <div className={`text-sm sm:text-base font-extrabold ${
                    item.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {item.type === 'expense' ? '-' : '+'}{formatRupee(item.amount)}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTransaction(item.id)}
                  title="Delete entry"
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
