import React, { useState, useEffect } from 'react';
import { CurrencyConfig, LoanType } from '../types';
import { calculateLoanSummary, formatCurrency } from '../utils/calculatorUtils';
import { Sparkles, X, Loader2, Bot, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  tenureMonths: number;
  currency: CurrencyConfig;
  loanType: LoanType;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  loanAmount,
  interestRate,
  tenureYears,
  tenureMonths,
  currency,
  loanType,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [advice, setAdvice] = useState<string>('');
  const [error, setError] = useState<string>('');

  const summary = calculateLoanSummary(
    loanAmount,
    interestRate,
    tenureYears,
    tenureMonths,
    0
  );

  const fetchAiAdvice = async () => {
    setLoading(true);
    setError('');
    setAdvice('');

    try {
      const response = await fetch('/api/loan-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanAmount,
          interestRate,
          tenureYears,
          tenureMonths,
          emi: summary.monthlyEmi,
          totalInterest: summary.totalInterest,
          totalPayment: summary.totalPayment,
          currencySymbol: currency.symbol,
          loanType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to AI Advisor.');
      }

      setAdvice(data.advice);
    } catch (err: any) {
      setError(err.message || 'Error generating AI Loan Report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !advice && !loading) {
      fetchAiAdvice();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                Gemini AI Financial Advisor
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-extrabold uppercase">
                  3.6 Flash
                </span>
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Custom analysis for {currency.symbol}
                {loanAmount.toLocaleString()} @ {interestRate}% p.a.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="font-bold text-gray-600 text-sm">
                Gemini AI is analyzing interest rates, tax benefits, and repayment risks...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Unable to fetch AI advice</p>
                <p className="text-xs text-rose-700 mt-1">{error}</p>
                <button
                  onClick={fetchAiAdvice}
                  className="mt-3 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap font-sans text-xs space-y-2 leading-normal">
              {advice}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-400 text-[11px] font-medium">
            *AI financial analysis is for informational planning purposes.
          </span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
