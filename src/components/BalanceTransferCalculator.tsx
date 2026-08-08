import React, { useState, useMemo } from 'react';
import { CurrencyConfig } from '../types';
import { calculateBalanceTransfer, formatCurrency } from '../utils/calculatorUtils';
import { Scale, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface BalanceTransferCalculatorProps {
  currency: CurrencyConfig;
}

export const BalanceTransferCalculator: React.FC<BalanceTransferCalculatorProps> = ({ currency }) => {
  const isINR = currency.code === 'INR';

  const [currentBalance, setCurrentBalance] = useState<number>(isINR ? 2000000 : 200000);
  const [currentRatePct, setCurrentRatePct] = useState<number>(10.5);
  const [remainingMonths, setRemainingMonths] = useState<number>(180); // 15 years

  const [newRatePct, setNewRatePct] = useState<number>(8.5);
  const [processingFeePct, setProcessingFeePct] = useState<number>(0.5);
  const [newTenureMonths, setNewTenureMonths] = useState<number>(180);

  const transferResult = useMemo(() => {
    return calculateBalanceTransfer(
      currentBalance,
      currentRatePct,
      remainingMonths,
      newRatePct,
      processingFeePct,
      newTenureMonths
    );
  }, [currentBalance, currentRatePct, remainingMonths, newRatePct, processingFeePct, newTenureMonths]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-blue-100 font-bold text-xs uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          Loan Balance Transfer Switcher
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Should You Refinance & Transfer Your Outstanding Loan?
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl font-medium">
          Check if switching your active loan to a lower interest lender will net you positive savings after deducting transfer processing fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Current Bank Loan */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Existing Bank Loan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500">Current Balance</label>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500">Current Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentRatePct}
                  onChange={(e) => setCurrentRatePct(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500">Remaining Term (Mo)</label>
                <input
                  type="number"
                  value={remainingMonths}
                  onChange={(e) => {
                    const months = Number(e.target.value);
                    setRemainingMonths(months);
                    setNewTenureMonths(months);
                  }}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* New Lender Bank */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              New Lender Bank
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500">New Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newRatePct}
                  onChange={(e) => setNewRatePct(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500">Transfer Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={processingFeePct}
                  onChange={(e) => setProcessingFeePct(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500">New Term (Mo)</label>
                <input
                  type="number"
                  value={newTenureMonths}
                  onChange={(e) => setNewTenureMonths(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Verdict Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Recommendation Banner */}
          <div
            className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 ${
              transferResult.isViable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {transferResult.isViable ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              )}
              <span className="text-sm font-extrabold uppercase tracking-wider">
                {transferResult.isViable
                  ? 'Transfer Highly Recommended!'
                  : 'Transfer Not Profitable'}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Net Savings After Fee</div>
              <div
                className={`text-3xl sm:text-4xl font-black mt-0.5 ${
                  transferResult.isViable ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {formatCurrency(transferResult.netSavings, currency)}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200/60 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                <span className="text-gray-500 block font-medium">Monthly EMI Reduced By</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  {formatCurrency(transferResult.monthlySavings, currency)}/mo
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                <span className="text-gray-500 block font-medium">Processing Fee Cost</span>
                <span className="font-extrabold text-amber-600 text-sm">
                  {formatCurrency(transferResult.newProcessingFeeAmount, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Side-by-side breakdown */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-gray-500">
              Detailed Loan Comparison
            </h4>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Monthly EMI</span>
                <div className="text-right flex items-center gap-1.5">
                  <span className="text-rose-600 font-bold">
                    {formatCurrency(transferResult.currentMonthlyEmi, currency)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-emerald-600 font-bold">
                    {formatCurrency(transferResult.newMonthlyEmi, currency)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Remaining Interest</span>
                <div className="text-right flex items-center gap-1.5">
                  <span className="text-rose-600 font-bold">
                    {formatCurrency(transferResult.currentRemainingInterest, currency)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-emerald-600 font-bold">
                    {formatCurrency(transferResult.newTotalInterest, currency)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 font-medium">Total Outflow</span>
                <div className="text-right font-extrabold text-gray-900 text-sm">
                  {formatCurrency(transferResult.newTotalPaymentWithFee, currency)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
