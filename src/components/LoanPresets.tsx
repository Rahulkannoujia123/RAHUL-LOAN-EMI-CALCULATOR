import React from 'react';
import { Home, User, Car, GraduationCap, Briefcase } from 'lucide-react';
import { LoanType, CurrencyConfig } from '../types';

interface LoanPresetsProps {
  selectedType: LoanType;
  onSelectPreset: (preset: {
    type: LoanType;
    amount: number;
    interestRate: number;
    tenureYears: number;
  }) => void;
  currency: CurrencyConfig;
}

export const LoanPresets: React.FC<LoanPresetsProps> = ({
  selectedType,
  onSelectPreset,
  currency
}) => {
  // Adjust base defaults according to INR vs USD/EUR
  const isINR = currency.code === 'INR';
  const multiplier = isINR ? 1 : 0.015; // approximate ratio for presets

  const presets = [
    {
      type: 'Home Loan' as LoanType,
      amount: isINR ? 2500000 : 250000,
      interestRate: 8.5,
      tenureYears: 20,
      icon: Home,
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      type: 'Personal Loan' as LoanType,
      amount: isINR ? 500000 : 25000,
      interestRate: 12.5,
      tenureYears: 5,
      icon: User,
      bgColor: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      type: 'Car Loan' as LoanType,
      amount: isINR ? 900000 : 35000,
      interestRate: 9.0,
      tenureYears: 7,
      icon: Car,
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      type: 'Education Loan' as LoanType,
      amount: isINR ? 1200000 : 45000,
      interestRate: 10.0,
      tenureYears: 10,
      icon: GraduationCap,
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      type: 'Business Loan' as LoanType,
      amount: isINR ? 2000000 : 100000,
      interestRate: 14.0,
      tenureYears: 5,
      icon: Briefcase,
      bgColor: 'bg-rose-50 text-rose-600 border-rose-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
      {presets.map((preset) => {
        const Icon = preset.icon;
        const isSelected = selectedType === preset.type;
        return (
          <button
            key={preset.type}
            onClick={() =>
              onSelectPreset({
                type: preset.type,
                amount: preset.amount,
                interestRate: preset.interestRate,
                tenureYears: preset.tenureYears
              })
            }
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/50 scale-[1.02]'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
            }`}
          >
            <div
              className={`p-2 rounded-xl mb-1.5 ${
                isSelected ? 'bg-white/20 text-white' : preset.bgColor
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{preset.type}</span>
            <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
              {preset.interestRate}% p.a.
            </span>
          </button>
        );
      })}
    </div>
  );
};
