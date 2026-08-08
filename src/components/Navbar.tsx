import React from 'react';
import {
  Calculator,
  Smartphone,
  Sparkles,
  Download,
  IndianRupee,
  DollarSign,
  Euro,
  PoundSterling,
  TrendingDown,
  Scale,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { CurrencyCode, CurrencyConfig } from '../types';
import { CURRENCIES } from '../utils/calculatorUtils';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: CurrencyConfig;
  setCurrency: (c: CurrencyConfig) => void;
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;
  openAiAdvisor: () => void;
  openApkModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  isMobileSimulator,
  setIsMobileSimulator,
  openAiAdvisor,
  openApkModal
}) => {
  const tabs = [
    { id: 'standard', label: 'EMI Calculator', icon: Calculator },
    { id: 'prepayment', label: 'Prepayment Savings', icon: TrendingDown },
    { id: 'transfer', label: 'Balance Transfer', icon: Scale },
    { id: 'eligibility', label: 'Loan Eligibility', icon: Lightbulb },
    { id: 'compare', label: 'Compare Tenure', icon: BarChart3 },
  ];

  const currencyIcons: Record<CurrencyCode, any> = {
    INR: IndianRupee,
    USD: DollarSign,
    EUR: Euro,
    GBP: PoundSterling
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('standard')}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
              %
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                  EMI<span className="text-blue-600">Pro</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block font-medium">Smart Loan & Financial Planner</p>
            </div>
          </div>

          {/* Center Tabs for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector Dropdown */}
            <div className="relative group">
              <select
                value={currency.code}
                onChange={(e) => setCurrency(CURRENCIES[e.target.value as CurrencyCode])}
                className="appearance-none bg-gray-100 hover:bg-gray-200/80 text-gray-800 border border-gray-300 rounded-xl text-xs font-bold px-3 py-2 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>

            {/* AI Advisor Button */}
            <button
              onClick={openAiAdvisor}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="hidden sm:inline">AI Advisor</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Mobile View Toggle */}
            <button
              onClick={() => setIsMobileSimulator(!isMobileSimulator)}
              title={isMobileSimulator ? "Switch to Fullscreen Web View" : "Simulate Mobile App Frame"}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isMobileSimulator
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Download APK / Source button */}
            <button
              onClick={openApkModal}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get APK</span>
              <span className="sm:hidden">APK</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Scrollbar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 scrollbar-none border-t border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
