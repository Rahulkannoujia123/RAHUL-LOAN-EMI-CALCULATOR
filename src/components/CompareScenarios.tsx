import React, { useState, useMemo } from 'react';
import { CurrencyConfig } from '../types';
import { calculateLoanSummary, formatCurrency, formatCompactCurrency } from '../utils/calculatorUtils';
import { BarChart3, Check, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CompareScenariosProps {
  currency: CurrencyConfig;
}

export const CompareScenarios: React.FC<CompareScenariosProps> = ({ currency }) => {
  const isINR = currency.code === 'INR';

  const [loanAmount, setLoanAmount] = useState<number>(isINR ? 2500000 : 250000);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  const tenuresToCompare = [10, 15, 20, 25, 30];

  const scenarios = useMemo(() => {
    return tenuresToCompare.map((years) => {
      const summary = calculateLoanSummary(loanAmount, interestRate, years, 0, 0);
      return {
        years,
        monthlyEmi: summary.monthlyEmi,
        totalInterest: summary.totalInterest,
        totalPayment: summary.totalPayment,
        principal: summary.principalAmount,
      };
    });
  }, [loanAmount, interestRate]);

  const chartData = useMemo(() => {
    return scenarios.map((s) => ({
      tenure: `${s.years} Yrs`,
      Principal: s.principal,
      Interest: s.totalInterest,
      EMI: s.monthlyEmi,
    }));
  }, [scenarios]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-purple-100 font-bold text-xs uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          Side-by-Side Tenure Comparison
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          10 Years vs 15 Years vs 20 Years vs 30 Years
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-2xl font-medium">
          Shorter tenure means higher monthly EMI but massive interest savings. Longer tenure lowers monthly EMI but doubles total interest paid.
        </p>
      </div>

      {/* Base Inputs */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500">Loan Amount</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500">Interest Rate (% p.a.)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Comparison Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {scenarios.map((item) => {
          const isSelected = item.years === 20;
          return (
            <div
              key={item.years}
              className={`rounded-3xl p-5 border transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {item.years} Years
                </span>
                {isSelected && (
                  <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className={`block text-[11px] font-medium ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>Monthly EMI</span>
                  <span className={`font-black text-base ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                    {formatCurrency(item.monthlyEmi, currency)}
                  </span>
                </div>

                <div>
                  <span className={`block text-[11px] font-medium ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>Total Interest</span>
                  <span className={`font-bold text-sm ${isSelected ? 'text-blue-100' : 'text-rose-600'}`}>
                    {formatCurrency(item.totalInterest, currency)}
                  </span>
                </div>

                <div className={`pt-2 border-t ${isSelected ? 'border-blue-500/50' : 'border-gray-100'}`}>
                  <span className={`block text-[11px] font-medium ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>Total Repayment</span>
                  <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(item.totalPayment, currency)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart Visualization */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
          Principal vs Total Interest Across Tenures
        </h4>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="tenure" stroke="#94a3b8" fontSize={11} />
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
              <Bar dataKey="Principal" stackId="a" fill="#2563eb" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Interest" stackId="a" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
