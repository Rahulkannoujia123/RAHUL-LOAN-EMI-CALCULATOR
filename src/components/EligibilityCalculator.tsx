import React, { useState, useMemo } from 'react';
import { CurrencyConfig } from '../types';
import { calculateEligibility, formatCurrency, formatCompactCurrency } from '../utils/calculatorUtils';
import { Lightbulb, CheckCircle, ShieldAlert, Award } from 'lucide-react';

interface EligibilityCalculatorProps {
  currency: CurrencyConfig;
}

export const EligibilityCalculator: React.FC<EligibilityCalculatorProps> = ({ currency }) => {
  const isINR = currency.code === 'INR';

  const [grossIncome, setGrossIncome] = useState<number>(isINR ? 100000 : 8000);
  const [existingEmis, setExistingEmis] = useState<number>(isINR ? 15000 : 1000);
  const [foirPct, setFoirPct] = useState<number>(50); // Default 50% FOIR benchmark
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const eligibility = useMemo(() => {
    return calculateEligibility(
      grossIncome,
      existingEmis,
      foirPct,
      interestRate,
      tenureYears
    );
  }, [grossIncome, existingEmis, foirPct, interestRate, tenureYears]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-amber-100 font-bold text-xs uppercase tracking-wider mb-1">
          <Lightbulb className="w-4 h-4" />
          Loan Eligibility & Affordability Meter
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          How Much Loan Amount Are You Eligible For?
        </h2>
        <p className="text-xs sm:text-sm text-amber-50 mt-1 max-w-2xl font-medium">
          Bank underwriting standards limit total monthly EMI payments to 40% - 60% of gross monthly salary (FOIR). Discover your borrowing ceiling instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-3">
            Income & Financial Obligations
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-500">Gross Monthly Income</label>
                <span className="font-bold text-amber-600">
                  {formatCurrency(grossIncome, currency)}/mo
                </span>
              </div>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-500">Existing Monthly EMIs / Obligations</label>
                <span className="font-bold text-rose-600">
                  {formatCurrency(existingEmis, currency)}/mo
                </span>
              </div>
              <input
                type="number"
                value={existingEmis}
                onChange={(e) => setExistingEmis(Math.max(0, Number(e.target.value)))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-500">FOIR Limit (%)</label>
                <input
                  type="number"
                  value={foirPct}
                  onChange={(e) => setFoirPct(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500">Expected Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-xs mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5">
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-100">
              Maximum Eligible Loan Amount
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatCurrency(eligibility.maxLoanAmount, currency)}
            </div>

            <div className="pt-4 border-t border-amber-400/50 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-amber-600/50 p-3.5 rounded-2xl backdrop-blur-sm">
                <span className="text-amber-100 block text-[11px] font-medium">Max Allowable EMI ({foirPct}%)</span>
                <span className="font-extrabold text-white text-sm">
                  {formatCurrency(eligibility.maxAllowableEmi, currency)}/mo
                </span>
              </div>

              <div className="bg-amber-600/50 p-3.5 rounded-2xl backdrop-blur-sm">
                <span className="text-amber-100 block text-[11px] font-medium">Available EMI Capacity</span>
                <span className="font-extrabold text-white text-sm">
                  {formatCurrency(eligibility.availableEmiCapacity, currency)}/mo
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-xs space-y-3">
            <h4 className="font-extrabold text-gray-900 uppercase tracking-wider">
              Tips to Increase Loan Eligibility
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Add a co-applicant (spouse or earning family member) to pool income.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clear small credit card balances or existing personal loans prior to applying.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Select a longer tenure (e.g. 25-30 years) to reduce required monthly EMI.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
