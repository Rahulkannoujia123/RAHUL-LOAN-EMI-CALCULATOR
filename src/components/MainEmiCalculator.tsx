import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CurrencyConfig, LoanType } from '../types';
import {
  calculateLoanSummary,
  formatCurrency,
  formatCompactCurrency
} from '../utils/calculatorUtils';
import { LoanPresets } from './LoanPresets';
import { Calculator, ArrowRight, ShieldCheck, DollarSign, Calendar, Percent, Info } from 'lucide-react';

interface MainEmiCalculatorProps {
  currency: CurrencyConfig;
  onViewAmortization: () => void;
}

export const MainEmiCalculator: React.FC<MainEmiCalculatorProps> = ({
  currency,
  onViewAmortization
}) => {
  const isINR = currency.code === 'INR';

  const [loanType, setLoanType] = useState<LoanType>('Home Loan');
  const [loanAmount, setLoanAmount] = useState<number>(isINR ? 2500000 : 250000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [tenureMonths, setTenureMonths] = useState<number>(0);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [processingFeePct, setProcessingFeePct] = useState<number>(0.5);

  const totalTenureInMonths = useMemo(() => {
    return tenureUnit === 'years' ? tenureYears * 12 + tenureMonths : tenureMonths;
  }, [tenureUnit, tenureYears, tenureMonths]);

  const summary = useMemo(() => {
    return calculateLoanSummary(
      loanAmount,
      interestRate,
      tenureUnit === 'years' ? tenureYears : 0,
      tenureUnit === 'months' ? tenureMonths : 0,
      processingFeePct
    );
  }, [loanAmount, interestRate, tenureYears, tenureMonths, tenureUnit, processingFeePct]);

  // Donut chart data
  const pieData = useMemo(() => {
    return [
      { name: 'Principal Amount', value: summary.principalAmount, color: '#3b82f6' },
      { name: 'Total Interest', value: summary.totalInterest, color: '#f43f5e' },
    ];
  }, [summary]);

  const handleSelectPreset = (preset: {
    type: LoanType;
    amount: number;
    interestRate: number;
    tenureYears: number;
  }) => {
    setLoanType(preset.type);
    setLoanAmount(preset.amount);
    setInterestRate(preset.interestRate);
    setTenureYears(preset.tenureYears);
    setTenureMonths(0);
    setTenureUnit('years');
  };

  const maxAmount = isINR ? 100000000 : 2000000; // 10 Cr or $2M

  return (
    <div className="space-y-6">
      {/* Preset Selector */}
      <LoanPresets
        selectedType={loanType}
        onSelectPreset={handleSelectPreset}
        currency={currency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Controls Column */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Loan Parameters
            </h2>
            <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-bold">
              {loanType}
            </span>
          </div>

          {/* 1. Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-gray-500">Loan Amount</label>
              <span className="font-extrabold text-blue-600 text-base">
                {formatCurrency(loanAmount, currency)}
                <span className="text-xs text-gray-400 font-medium ml-1">
                  ({formatCompactCurrency(loanAmount, currency)})
                </span>
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                {currency.symbol}
              </span>
              <input
                type="number"
                value={loanAmount || ''}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Enter loan amount"
              />
            </div>

            <input
              type="range"
              min={isINR ? 50000 : 1000}
              max={maxAmount}
              step={isINR ? 50000 : 1000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(isINR
                ? [500000, 1000000, 2500000, 5000000, 10000000]
                : [10000, 50000, 100000, 250000, 500000]
              ).map((amt) => (
                <button
                  key={amt}
                  onClick={() => setLoanAmount(amt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    loanAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {formatCompactCurrency(amt, currency)}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-gray-500">Interest Rate (p.a)</label>
              <span className="font-extrabold text-blue-600 text-base">{interestRate}%</span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                %
              </span>
              <input
                type="number"
                step="0.1"
                min="1"
                max="35"
                value={interestRate || ''}
                onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <input
              type="range"
              min={1}
              max={30}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 3. Tenure Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-gray-500">Loan Tenure</label>
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setTenureUnit('years')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                    tenureUnit === 'years'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Yr
                </button>
                <button
                  onClick={() => {
                    setTenureUnit('months');
                    if (tenureMonths === 0 && tenureYears > 0) {
                      setTenureMonths(tenureYears * 12);
                    }
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                    tenureUnit === 'months'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Mo
                </button>
              </div>
            </div>

            {tenureUnit === 'years' ? (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={tenureYears || ''}
                    onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                    Years ({tenureYears * 12} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                {/* Quick Tenure Buttons */}
                <div className="flex gap-1.5 pt-1">
                  {[5, 10, 15, 20, 25, 30].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setTenureYears(yr)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        tenureYears === yr
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {yr}Y
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={tenureMonths || ''}
                    onChange={(e) => setTenureMonths(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                    Months ({(tenureMonths / 12).toFixed(1)} Years)
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={360}
                  step={6}
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>

          {/* 4. Processing Fee */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-500 flex items-center gap-1">
                Processing Fee (%)
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </label>
              <span className="font-bold text-gray-700">
                {processingFeePct}% ({formatCurrency(summary.totalProcessingFee, currency)})
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={processingFeePct}
              onChange={(e) => setProcessingFeePct(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Results & Visual Chart Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main EMI Highlight Card (Vibrant Solid Blue in Clean Minimalism) */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Monthly EMI Payable</p>
              <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {formatCurrency(summary.monthlyEmi, currency)}
              </h3>
            </div>

            <div className="grid grid-cols-2 mt-8 gap-4">
              <div className="bg-blue-500/30 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs font-medium mb-1">Total Interest</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalInterest, currency)}</p>
              </div>

              <div className="bg-blue-500/30 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs font-medium mb-1">Total Payment</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalPayment, currency)}</p>
              </div>
            </div>
          </div>

          {/* Breakup Chart Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Breakdown Analysis</h2>
              <div className="flex gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600" /> Principal
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-200" /> Interest
                </div>
              </div>
            </div>

            <div className="w-full h-52 relative my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Principal Amount', value: summary.principalAmount, color: '#2563eb' },
                      { name: 'Total Interest', value: summary.totalInterest, color: '#bfdbfe' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#2563eb" stroke="#ffffff" strokeWidth={2} />
                    <Cell fill="#bfdbfe" stroke="#ffffff" strokeWidth={2} />
                  </Pie>
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
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black text-gray-900">{summary.ratioPrincipalPct}%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Principal</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-blue-600 shrink-0" />
                <div>
                  <div className="text-gray-500 font-medium">Principal ({summary.ratioPrincipalPct}%)</div>
                  <div className="font-extrabold text-gray-900 text-sm">
                    {formatCurrency(summary.principalAmount, currency)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-blue-200 shrink-0" />
                <div>
                  <div className="text-gray-500 font-medium">Interest ({summary.ratioInterestPct}%)</div>
                  <div className="font-extrabold text-gray-900 text-sm">
                    {formatCurrency(summary.totalInterest, currency)}
                  </div>
                </div>
              </div>
            </div>

            {/* View Full Amortization Button */}
            <button
              onClick={onViewAmortization}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              View Month-by-Month Schedule
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
