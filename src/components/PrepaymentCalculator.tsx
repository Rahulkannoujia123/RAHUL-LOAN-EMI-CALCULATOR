import React, { useState, useMemo } from 'react';
import { CurrencyConfig } from '../types';
import {
  calculatePrepaymentComparison,
  formatCurrency,
  formatCompactCurrency
} from '../utils/calculatorUtils';
import { TrendingDown, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PrepaymentCalculatorProps {
  currency: CurrencyConfig;
}

export const PrepaymentCalculator: React.FC<PrepaymentCalculatorProps> = ({ currency }) => {
  const isINR = currency.code === 'INR';

  const [loanAmount, setLoanAmount] = useState<number>(isINR ? 3000000 : 300000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // Prepayment options
  const [extraMonthly, setExtraMonthly] = useState<number>(isINR ? 5000 : 500);
  const [annualLumpSum, setAnnualLumpSum] = useState<number>(isINR ? 100000 : 10000);
  const [lumpSumMonth, setLumpSumMonth] = useState<number>(12); // default month 12 of every year
  const [strategy, setStrategy] = useState<'reduce_tenure' | 'reduce_emi'>('reduce_tenure');

  const comparison = useMemo(() => {
    return calculatePrepaymentComparison(
      loanAmount,
      interestRate,
      tenureYears * 12,
      extraMonthly,
      annualLumpSum,
      lumpSumMonth,
      strategy
    );
  }, [loanAmount, interestRate, tenureYears, extraMonthly, annualLumpSum, lumpSumMonth, strategy]);

  // Chart data comparing original vs prepayment balance progression sampled yearly
  const chartData = useMemo(() => {
    const data = [];
    const maxMonths = Math.max(
      comparison.originalSchedule.length,
      comparison.scheduleWithPrepayment.length
    );

    for (let month = 0; month <= maxMonths; month += 12) {
      const origRow = comparison.originalSchedule.find((r) => r.monthNumber === month) ||
        (month === 0 ? { closingBalance: loanAmount } : { closingBalance: 0 });
      const prepRow = comparison.scheduleWithPrepayment.find((r) => r.monthNumber === month) ||
        (month === 0 ? { closingBalance: loanAmount } : { closingBalance: 0 });

      data.push({
        year: `Yr ${Math.floor(month / 12)}`,
        'Without Prepayment': Math.round(origRow.closingBalance),
        'With Prepayment': Math.round(prepRow.closingBalance),
      });
    }
    return data;
  }, [comparison, loanAmount]);

  const tenureYearsSaved = (comparison.tenureReducedMonths / 12).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-emerald-100 font-bold text-xs uppercase tracking-wider mb-1">
          <TrendingDown className="w-4 h-4" />
          Smart Loan Prepayment Analyzer
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Slash Your Total Interest & Finish Your Loan Years Early!
        </h2>
        <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-2xl font-medium">
          See how making small extra monthly payments or an annual lump-sum bonus payment can save you thousands in interest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-3">
            1. Base Loan Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500">Loan Amount</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">Tenure (Years)</label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <h3 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider border-b border-gray-100 pt-2 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            2. Extra Prepayment Options
          </h3>

          {/* Extra Monthly Payment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-600">Extra Monthly Payment</label>
              <span className="font-bold text-emerald-600">
                +{formatCurrency(extraMonthly, currency)}/mo
              </span>
            </div>
            <input
              type="number"
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <input
              type="range"
              min={0}
              max={isINR ? 50000 : 5000}
              step={isINR ? 1000 : 100}
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Annual Lump Sum Payment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-600">Annual Lump-Sum Prepayment</label>
              <span className="font-bold text-emerald-600">
                +{formatCurrency(annualLumpSum, currency)}/yr
              </span>
            </div>
            <input
              type="number"
              value={annualLumpSum}
              onChange={(e) => setAnnualLumpSum(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <input
              type="range"
              min={0}
              max={isINR ? 1000000 : 50000}
              step={isINR ? 10000 : 1000}
              value={annualLumpSum}
              onChange={(e) => setAnnualLumpSum(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Prepayment Strategy Choice */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-gray-600 block">Prepayment Impact Goal</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStrategy('reduce_tenure')}
                className={`p-3.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                  strategy === 'reduce_tenure'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-extrabold text-xs">Reduce Tenure</div>
                <div className={`text-[10px] mt-0.5 font-medium ${strategy === 'reduce_tenure' ? 'text-emerald-100' : 'text-gray-500'}`}>Keep EMI same, pay off loan faster</div>
              </button>

              <button
                onClick={() => setStrategy('reduce_emi')}
                className={`p-3.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                  strategy === 'reduce_emi'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-extrabold text-xs">Reduce EMI</div>
                <div className={`text-[10px] mt-0.5 font-medium ${strategy === 'reduce_emi' ? 'text-emerald-100' : 'text-gray-500'}`}>Lower your monthly EMI obligation</div>
              </button>
            </div>
          </div>
        </div>

        {/* Results & Comparison Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Key Impact Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
              Total Interest Savings
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
              {formatCurrency(comparison.interestSaved, currency)}
            </div>

            {strategy === 'reduce_tenure' ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 font-semibold">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  Loan term cut down by <span className="font-extrabold text-emerald-700">{tenureYearsSaved} Years</span> ({comparison.tenureReducedMonths} Months)!
                  <div className="text-[11px] text-emerald-700 font-normal">
                    Finished in {Math.ceil(comparison.newTenureMonths / 12)} years instead of {tenureYears} years.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  Monthly EMI reduced to <span className="font-extrabold text-emerald-700">{formatCurrency(comparison.newEmiIfEmiReduced, currency)}</span>!
                </div>
              </div>
            )}

            {/* Comparison Table */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-gray-100">
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <span className="text-gray-500 block text-[11px] font-medium">Original Interest</span>
                <span className="font-bold text-rose-600 text-sm">
                  {formatCurrency(comparison.originalTotalInterest, currency)}
                </span>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-emerald-700 block text-[11px] font-medium">New Total Interest</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {formatCurrency(comparison.newTotalInterest, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Payoff Curve Chart */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
              Loan Balance Paydown Curve
            </h4>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => formatCompactCurrency(val, currency)}
                  />
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val, currency), '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#111827',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="Without Prepayment"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="With Prepayment"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
