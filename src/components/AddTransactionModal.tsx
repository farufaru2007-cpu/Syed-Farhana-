import React, { useState } from 'react';
import { X, Plus, Sparkles, Check, IndianRupee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../data/categories';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('🍛 Food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setErrorMsg(null);
    if (newType === 'expense') {
      setCategory('🍛 Food');
    } else {
      setCategory('Pocket Money');
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + addValue).toString());
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid amount in ₹.');
      return;
    }

    const cleanTitle = title.trim() || (type === 'expense' ? `${category.replace(/^[^\w\s]+/, '').trim()} Expense` : `${category} Income`);

    onAddTransaction({
      type,
      amount: parsedAmount,
      title: cleanTitle,
      category,
      paymentMethod,
      date,
      note: note.trim() || undefined,
    });

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore confetti if not supported
    }

    // Reset fields
    setAmount('');
    setTitle('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🇮🇳</span>
            <h2 className="text-lg font-bold text-slate-900">
              Add New Transaction
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Expense / Income Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 text-sm font-bold rounded-xl transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💸 Expense (खर्च)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 text-sm font-bold rounded-xl transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💵 Income (कमाई)
            </button>
          </div>

          {/* Amount Input with Indian Rupee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount (₹ Indian Rupee) *
            </label>
            <div className="relative rounded-2xl border-2 border-orange-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all bg-white">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl font-bold text-orange-600">₹</span>
              </div>
              <input
                type="number"
                step="any"
                min="1"
                required
                autoFocus
                placeholder="Enter amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 text-2xl font-extrabold text-slate-900 rounded-2xl focus:outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[20, 50, 100, 200, 500, 2000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 transition-colors"
                >
                  +₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Description / Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Title / Merchant (e.g. Swiggy, Chai Tapri, Auto, Jio)
            </label>
            <input
              type="text"
              placeholder={type === 'expense' ? 'e.g. Swiggy Biryani / Metro Card' : 'e.g. Monthly Pocket Money'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
              {type === 'expense'
                ? EXPENSE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-semibold text-left transition-all ${
                        category === cat.name
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.name.replace(/^[^\w\s]+/, '').trim()}</span>
                    </button>
                  ))
                : INCOME_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-semibold text-left transition-all ${
                        category === cat.name
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Indian Payment Method *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.name}
                  type="button"
                  onClick={() => setPaymentMethod(pm.name)}
                  className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl text-xs font-semibold transition-all ${
                    paymentMethod === pm.name
                      ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900 ring-offset-1'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{pm.icon}</span>
                  <span className="truncate">{pm.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Optional Note / Split with friends
            </label>
            <input
              type="text"
              placeholder="e.g. Split with Rahul, UPI ref 4920..., canteen discount"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="block w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-[0.98] ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'
              }`}
            >
              Add {type === 'expense' ? 'Kharcha (Expense)' : 'Kamai (Income)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
