import React, { useState } from 'react';
import { CurrencyConfig, LoanType } from './types';
import { CURRENCIES } from './utils/calculatorUtils';
import { Navbar } from './components/Navbar';
import { MainEmiCalculator } from './components/MainEmiCalculator';
import { PrepaymentCalculator } from './components/PrepaymentCalculator';
import { BalanceTransferCalculator } from './components/BalanceTransferCalculator';
import { EligibilityCalculator } from './components/EligibilityCalculator';
import { CompareScenarios } from './components/CompareScenarios';
import { AmortizationTable } from './components/AmortizationTable';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { Smartphone, Sparkles, Download, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('standard');
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.INR);
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(true);

  // Shared calculation state for amortization view
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        isMobileSimulator={isMobileSimulator}
        setIsMobileSimulator={setIsMobileSimulator}
        openAiAdvisor={() => setIsAiModalOpen(true)}
        openApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main Container */}
      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isMobileSimulator ? (
          /* Mobile Device Frame Simulator Mode */
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full">
                React Native Mobile View Simulator
              </span>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                Preview how the EMI Calculator looks and feels on a modern smartphone.
              </p>
            </div>

            {/* Smartphone Outer Shell */}
            <div className="w-[380px] h-[780px] bg-white border-[8px] border-gray-800 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-gray-900/10">
              {/* Phone Notch / Dynamic Island */}
              <div className="w-full bg-gray-900 pt-3 pb-2 px-6 flex justify-between items-center text-[10px] text-gray-300 font-bold z-20">
                <span>09:41</span>
                <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-800" />
                </div>
                <div className="flex gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Mobile App Screen */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-gray-50 scrollbar-thin">
                {activeTab === 'standard' && (
                  <MainEmiCalculator
                    currency={currency}
                    onViewAmortization={() => setActiveTab('amortization')}
                  />
                )}
                {activeTab === 'prepayment' && <PrepaymentCalculator currency={currency} />}
                {activeTab === 'transfer' && <BalanceTransferCalculator currency={currency} />}
                {activeTab === 'eligibility' && <EligibilityCalculator currency={currency} />}
                {activeTab === 'compare' && <CompareScenarios currency={currency} />}
                {activeTab === 'amortization' && (
                  <AmortizationTable
                    loanAmount={loanAmount}
                    interestRate={interestRate}
                    tenureYears={tenureYears}
                    tenureMonths={0}
                    currency={currency}
                  />
                )}
              </div>

              {/* Phone Home Indicator Bar */}
              <div className="w-full bg-gray-900 py-2 flex justify-center items-center z-20">
                <div className="w-32 h-1 bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Fullscreen Desktop/Tablet Layout */
          <div className="space-y-8">
            {activeTab === 'standard' && (
              <>
                <MainEmiCalculator
                  currency={currency}
                  onViewAmortization={() => setActiveTab('amortization')}
                />
                <AmortizationTable
                  loanAmount={loanAmount}
                  interestRate={interestRate}
                  tenureYears={tenureYears}
                  tenureMonths={0}
                  currency={currency}
                />
              </>
            )}

            {activeTab === 'prepayment' && <PrepaymentCalculator currency={currency} />}
            {activeTab === 'transfer' && <BalanceTransferCalculator currency={currency} />}
            {activeTab === 'eligibility' && <EligibilityCalculator currency={currency} />}
            {activeTab === 'compare' && <CompareScenarios currency={currency} />}
            {activeTab === 'amortization' && (
              <AmortizationTable
                loanAmount={loanAmount}
                interestRate={interestRate}
                tenureYears={tenureYears}
                tenureMonths={0}
                currency={currency}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-4 text-gray-600 font-medium">
          <button onClick={() => setIsApkModalOpen(true)} className="hover:text-blue-600 transition-colors cursor-pointer">
            Get React Native APK
          </button>
          <span>•</span>
          <button onClick={() => setIsAiModalOpen(true)} className="hover:text-purple-600 transition-colors cursor-pointer">
            Gemini AI Advisor
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('standard')} className="hover:text-blue-600 transition-colors cursor-pointer">
            EMI Calculator
          </button>
        </div>
        <p className="text-gray-400">© {new Date().getFullYear()} EMI Master Pro. Financial calculations are subject to lender interest terms.</p>
      </footer>

      {/* Modals */}
      <AiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        loanAmount={loanAmount}
        interestRate={interestRate}
        tenureYears={tenureYears}
        tenureMonths={0}
        currency={currency}
        loanType="Home Loan"
      />

      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
