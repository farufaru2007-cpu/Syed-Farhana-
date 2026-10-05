import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Check, AlertCircle, Loader2, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction, PaymentMethod } from '../types';
import { formatRupee } from '../utils/formatters';

interface AISmartScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const AISmartScannerModal: React.FC<AISmartScannerModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<{
    type: 'expense' | 'income';
    amount: number;
    title: string;
    category: string;
    paymentMethod: PaymentMethod;
    date: string;
    note?: string;
    confidenceReason?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleParse = async (textToParse?: string) => {
    const text = textToParse || inputText;
    if (!text.trim()) {
      setError('Please fill this slot with an SMS or transaction text to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedResult(null);

    try {
      const response = await fetch('/api/ai/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to parse with AI');
      }

      setParsedResult(resData.data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err?.message || 'Could not parse message. Please check server or try manual entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (!parsedResult) return;

    onAddTransaction({
      type: parsedResult.type,
      amount: parsedResult.amount,
      title: parsedResult.title,
      category: parsedResult.category,
      paymentMethod: parsedResult.paymentMethod,
      date: parsedResult.date,
      note: parsedResult.note,
    });

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {
      // Ignore
    }

    // Reset and close
    setInputText('');
    setParsedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                AI SMS & Receipt Scanner
                <span className="text-xs bg-orange-200 text-orange-900 font-semibold px-2 py-0.5 rounded-full">
                  Gemini AI
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Paste any Indian bank SMS, UPI alert, or casual text
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

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Text Area Blank Slot */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Paste Your Bank SMS, UPI Alert, or Enter Payment Note:
            </label>
            <textarea
              rows={4}
              placeholder="Paste SMS here (e.g. Paid Rs ... via UPI / Credited with Rs ... / Paid cash for ...)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400 bg-slate-50/50"
            />
          </div>

          {/* Parse Button */}
          <button
            type="button"
            disabled={isLoading || !inputText.trim()}
            onClick={() => handleParse()}
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reading with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Transaction with AI</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Result Card */}
          {parsedResult && (
            <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 rounded-2xl space-y-3 animate-fade-in shadow-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <Check className="w-3.5 h-3.5" /> Successfully Detected
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  parsedResult.type === 'expense' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {parsedResult.type === 'expense' ? '💸 Expense' : '💵 Income'}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {parsedResult.title}
                  </h4>
                  <p className="text-xs text-slate-500">{parsedResult.date}</p>
                </div>
                <div className={`text-2xl font-black ${
                  parsedResult.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  {formatRupee(parsedResult.amount)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700">
                  Category: {parsedResult.category}
                </span>
                <span className="px-2.5 py-1 bg-purple-100 border border-purple-200 rounded-lg font-semibold text-purple-800">
                  Payment: {parsedResult.paymentMethod}
                </span>
                {parsedResult.note && (
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 truncate max-w-full">
                    Ref: {parsedResult.note}
                  </span>
                )}
              </div>

              {parsedResult.confidenceReason && (
                <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-100">
                  💡 {parsedResult.confidenceReason}
                </p>
              )}

              <button
                type="button"
                onClick={handleApprove}
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-[0.98]"
              >
                <span>Add to Tracker Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
