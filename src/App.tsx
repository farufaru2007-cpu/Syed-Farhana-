/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, PaymentMethod } from './types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from './data/categories';
import { Navbar } from './components/Navbar';
import { DashboardCards } from './components/DashboardCards';
import { BudgetTracker } from './components/BudgetTracker';
import { ChartsSection } from './components/ChartsSection';
import { TransactionHistory } from './components/TransactionHistory';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AISmartScannerModal } from './components/AISmartScannerModal';
import { AIFinancialDostModal } from './components/AIFinancialDostModal';
import { PlusCircle, Sparkles, Bot, Shield, Heart, Plus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_TRANSACTIONS = 'indian_expense_tracker_user_v2';
const STORAGE_KEY_BUDGET = 'indian_expense_tracker_budget_v2';

export default function App() {
  // Start with completely blank places / empty array
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only return if valid array and not the old sample data
        if (Array.isArray(parsed) && !parsed.some((t: any) => t.id === 'tx-1')) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading saved transactions:', err);
    }
    return [];
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUDGET);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return 10000; // default ₹10,000 / month
  });

  // Inline Quick Slot Form state (blank places for user to fill)
  const [slotType, setSlotType] = useState<TransactionType>('expense');
  const [slotAmount, setSlotAmount] = useState<string>('');
  const [slotTitle, setSlotTitle] = useState<string>('');
  const [slotCategory, setSlotCategory] = useState<string>('🍛 Food');
  const [slotPaymentMethod, setSlotPaymentMethod] = useState<PaymentMethod>('UPI');
  const [slotDate, setSlotDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slotNote, setSlotNote] = useState<string>('');
  const [slotError, setSlotError] = useState<string | null>(null);
  const [slotSuccessMessage, setSlotSuccessMessage] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIScannerOpen, setIsAIScannerOpen] = useState(false);
  const [isAIDostOpen, setIsAIDostOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (err) {
      console.error('Failed to persist transactions:', err);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGET, monthlyBudget.toString());
    } catch (err) {
      console.error('Failed to persist budget:', err);
    }
  }, [monthlyBudget]);

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const moneyAvailable = totalIncome - totalSpent;
  const moneySaved = Math.max(0, totalIncome - totalSpent);
  const savingsRate = totalIncome > 0 ? Math.round((moneySaved / totalIncome) * 100) : 0;

  // Handlers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleInlineSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotError(null);
    const val = parseFloat(slotAmount);
    if (isNaN(val) || val <= 0) {
      setSlotError('Please fill in a valid amount in ₹');
      return;
    }

    const cleanTitle = slotTitle.trim() || (slotType === 'expense' ? `${slotCategory} Expense` : `${slotCategory} Income`);

    handleAddTransaction({
      type: slotType,
      amount: val,
      title: cleanTitle,
      category: slotCategory,
      paymentMethod: slotPaymentMethod,
      date: slotDate,
      note: slotNote.trim() || undefined,
    });

    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch {
      // Ignore
    }

    // Reset blank slots
    setSlotAmount('');
    setSlotTitle('');
    setSlotNote('');
    setSlotSuccessMessage(true);
    setTimeout(() => setSlotSuccessMessage(false), 3000);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAll = () => {
    setTransactions([]);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAIScanner={() => setIsAIScannerOpen(true)}
        onOpenAIDost={() => setIsAIDostOpen(true)}
        transactionCount={transactions.length}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {/* Welcome Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <span>Namaste!</span>
              <span className="text-lg">🙏</span>
              <span className="text-orange-600 font-bold">Track Your Daily Kharcha</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Clean and blank slots ready for you to fill your daily income & expenses in Indian Rupees (₹).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Private (On-Device)</span>
            </span>
          </div>
        </div>

        {/* 1. SIMPLE HOME DASHBOARD CARDS (Money Available, Total Income, Total Spent, Money Saved) */}
        <DashboardCards
          moneyAvailable={moneyAvailable}
          totalIncome={totalIncome}
          totalSpent={totalSpent}
          moneySaved={moneySaved}
          savingsRate={savingsRate}
        />

        {/* BLANK PLACES / SLOTS FORM: Ready for user to fill */}
        <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-5 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-orange-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                ✍️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Fill In Your Transaction Slots
                </h3>
                <p className="text-xs text-slate-500">
                  Blank slots ready for you to type your amount, category & payment mode
                </p>
              </div>
            </div>

            {slotSuccessMessage && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Saved to your tracker!
              </span>
            )}
          </div>

          <form onSubmit={handleInlineSlotSubmit} className="space-y-4">
            {/* Slot 1: Type Selection (Expense vs Income) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[70px]">
                Slot 1:
              </span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSlotType('expense');
                    setSlotCategory('🍛 Food');
                  }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    slotType === 'expense'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  💸 Expense (खर्च)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSlotType('income');
                    setSlotCategory('Pocket Money');
                  }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    slotType === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  💵 Income (कमाई)
                </button>
              </div>
            </div>

            {/* Grid of Blank Input Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Slot 2: Amount (₹) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Slot 2: Amount (₹) *
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all bg-white">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    placeholder="Enter amount..."
                    value={slotAmount}
                    onChange={(e) => setSlotAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold text-slate-900 rounded-xl focus:outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Slot 3: Title / Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Slot 3: Title / What for? *
                </label>
                <input
                  type="text"
                  placeholder="Enter purpose / item name..."
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-300"
                />
              </div>

              {/* Slot 4: Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Slot 4: Category *
                </label>
                <select
                  value={slotCategory}
                  onChange={(e) => setSlotCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-medium text-slate-800"
                >
                  {slotType === 'expense'
                    ? EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    : INCOME_CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                </select>
              </div>

              {/* Slot 5: Payment Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Slot 5: Payment Mode *
                </label>
                <select
                  value={slotPaymentMethod}
                  onChange={(e) => setSlotPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-medium text-slate-800"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm.name} value={pm.name}>
                      {pm.icon} {pm.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Date & Optional Note */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Slot 6: Date *
                </label>
                <input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Slot 7: Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter optional note, reference or split info..."
                  value={slotNote}
                  onChange={(e) => setSlotNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Error Message */}
            {slotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {slotError}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Entry to Tracker</span>
              </button>
            </div>
          </form>
        </div>

        {/* Monthly Budget & Daily Safe-to-Spend Limit */}
        <BudgetTracker
          monthlyBudget={monthlyBudget}
          totalSpent={totalSpent}
          onUpdateBudget={(val) => setMonthlyBudget(val)}
        />

        {/* Charts & Analytics */}
        <ChartsSection
          transactions={transactions}
          totalSpent={totalSpent}
        />

        {/* Searchable Transaction History */}
        <TransactionHistory
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
          onClearAll={handleClearAll}
        />
      </main>

      {/* Floating Action Button on Mobile */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden flex items-center justify-between gap-2 p-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200">
        <button
          onClick={() => setIsAIScannerOpen(true)}
          className="flex-1 py-2.5 px-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center justify-center space-x-1.5 border border-amber-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Scan SMS</span>
        </button>

        <button
          onClick={() => setIsAIDostOpen(true)}
          className="flex-1 py-2.5 px-2 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center space-x-1.5 border border-indigo-200"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Dost</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex-1.2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md flex items-center justify-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>🇮🇳 AI Personal Expense Tracker – India</span>
            <span>•</span>
            <span>Made for Indian Students & Young Professionals</span>
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>in Indian Rupees (₹)</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <AISmartScannerModal
        isOpen={isAIScannerOpen}
        onClose={() => setIsAIScannerOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <AIFinancialDostModal
        isOpen={isAIDostOpen}
        onClose={() => setIsAIDostOpen(false)}
        totalIncome={totalIncome}
        totalSpent={totalSpent}
        moneyAvailable={moneyAvailable}
        savingsRate={savingsRate}
        monthlyBudget={monthlyBudget}
        transactions={transactions}
      />
    </div>
  );
}
