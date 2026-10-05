import React from 'react';
import { PlusCircle, Sparkles, Bot, RotateCcw, IndianRupee, Wallet } from 'lucide-react';
import { getCurrentMonthName } from '../utils/formatters';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenAIScanner: () => void;
  onOpenAIDost: () => void;
  transactionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenAIScanner,
  onOpenAIDost,
  transactionCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Indian Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl">
                🇮🇳
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center">
                  AI Expense Tracker
                </h1>
                <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                  India
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center space-x-1.5 font-medium">
                <span>Kharcha & Kamai</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{getCurrentMonthName()}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI Dost Advice Button */}
            <button
              onClick={onOpenAIDost}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all shadow-xs hover:shadow-sm"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Ask AI Dost</span>
              <span className="sm:hidden">AI Dost</span>
            </button>

            {/* AI SMS / UPI Scanner */}
            <button
              onClick={onOpenAIScanner}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-xs hover:shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="hidden sm:inline">Scan SMS / UPI</span>
              <span className="sm:hidden">Scan SMS</span>
            </button>

            {/* + Add Transaction Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Fill Slots (+ Add)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
