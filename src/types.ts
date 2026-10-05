export type TransactionType = 'expense' | 'income';

export type PaymentMethod =
  | 'UPI'
  | 'Cash'
  | 'Debit Card'
  | 'Credit Card'
  | 'Bank Transfer'
  | 'Net Banking'
  | 'Other';

export type ExpenseCategory =
  | '🍛 Food'
  | '🛒 Groceries'
  | '🛍️ Shopping'
  | '🚌 Travel & Transport'
  | '📱 Mobile Recharge'
  | '💡 Electricity & Bills'
  | '🎓 Education'
  | '🏥 Health'
  | '🎬 Entertainment'
  | '🏠 Rent'
  | '💳 EMI'
  | '☕ Snacks & Tea'
  | '✈️ Travel'
  | '🧴 Personal Care'
  | '📦 Other';

export type IncomeCategory =
  | 'Salary'
  | 'Pocket Money'
  | 'Freelance'
  | 'Business'
  | 'Scholarship'
  | 'Allowance'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  title: string;
  category: string;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
}

export interface BudgetConfig {
  monthlyBudget: number;
  savingsGoal: number;
  month: string; // YYYY-MM
}

export interface AIFinancialAdvice {
  status: 'great' | 'caution' | 'critical';
  headline: string;
  dailySafeSpend: string;
  topInsight: string;
  actionableTips: string[];
  motivationalQuote: string;
}
