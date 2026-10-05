import { ExpenseCategory, IncomeCategory, PaymentMethod } from '../types';

export const EXPENSE_CATEGORIES: { name: ExpenseCategory; icon: string; color: string; bg: string }[] = [
  { name: '🍛 Food', icon: '🍛', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  { name: '☕ Snacks & Tea', icon: '☕', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  { name: '🛒 Groceries', icon: '🛒', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { name: '🛍️ Shopping', icon: '🛍️', color: 'text-pink-700', bg: 'bg-pink-50 border-pink-200' },
  { name: '🚌 Travel & Transport', icon: '🚌', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  { name: '📱 Mobile Recharge', icon: '📱', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  { name: '💡 Electricity & Bills', icon: '💡', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  { name: '🎓 Education', icon: '🎓', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  { name: '🏥 Health', icon: '🏥', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  { name: '🎬 Entertainment', icon: '🎬', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  { name: '🏠 Rent', icon: '🏠', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
  { name: '💳 EMI', icon: '💳', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  { name: '✈️ Travel', icon: '✈️', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  { name: '🧴 Personal Care', icon: '🧴', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50 border-fuchsia-200' },
  { name: '📦 Other', icon: '📦', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
];

export const INCOME_CATEGORIES: { name: IncomeCategory; icon: string; color: string; bg: string }[] = [
  { name: 'Salary', icon: '💼', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { name: 'Pocket Money', icon: '🪙', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  { name: 'Freelance', icon: '💻', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  { name: 'Business', icon: '🏢', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  { name: 'Scholarship', icon: '🎓', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  { name: 'Allowance', icon: '💵', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  { name: 'Other', icon: '✨', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
];

export const PAYMENT_METHODS: { name: PaymentMethod; icon: string; badgeClass: string }[] = [
  { name: 'UPI', icon: '⚡', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
  { name: 'Cash', icon: '💵', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { name: 'Debit Card', icon: '💳', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Credit Card', icon: '💎', badgeClass: 'bg-pink-100 text-pink-800 border-pink-200' },
  { name: 'Bank Transfer', icon: '🏦', badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { name: 'Net Banking', icon: '🌐', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  { name: 'Other', icon: '🔖', badgeClass: 'bg-slate-100 text-slate-800 border-slate-200' },
];

export const POPULAR_MERCHANTS: { title: string; category: ExpenseCategory; amount?: number; method: PaymentMethod }[] = [
  { title: 'Chai & Samosa Tapri', category: '☕ Snacks & Tea', amount: 30, method: 'UPI' },
  { title: 'Swiggy Food Order', category: '🍛 Food', amount: 240, method: 'UPI' },
  { title: 'Blinkit Instant Grocery', category: '🛒 Groceries', amount: 350, method: 'UPI' },
  { title: 'Metro Smart Card Recharge', category: '🚌 Travel & Transport', amount: 200, method: 'UPI' },
  { title: 'Auto Rickshaw', category: '🚌 Travel & Transport', amount: 50, method: 'Cash' },
  { title: 'Jio / Airtel Monthly Pack', category: '📱 Mobile Recharge', amount: 299, method: 'UPI' },
  { title: 'Hostel / Room Rent', category: '🏠 Rent', amount: 6500, method: 'Bank Transfer' },
  { title: 'College Books & Notes', category: '🎓 Education', amount: 450, method: 'Cash' },
];
