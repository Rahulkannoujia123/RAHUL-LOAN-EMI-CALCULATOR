export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  formatLakhs: boolean;
}

export type LoanType = 'Home Loan' | 'Personal Loan' | 'Car Loan' | 'Education Loan' | 'Business Loan';

export interface LoanPreset {
  id: string;
  title: LoanType;
  defaultAmount: number;
  defaultInterestRate: number;
  defaultTenureYears: number;
  iconName: string;
  description: string;
}

export interface CalculationResult {
  monthlyEmi: number;
  principalAmount: number;
  totalInterest: number;
  totalProcessingFee: number;
  totalPayment: number;
  ratioPrincipalPct: number;
  ratioInterestPct: number;
}

export interface AmortizationRow {
  monthNumber: number;
  yearNumber: number;
  dateStr: string;
  openingBalance: number;
  emiPaid: number;
  principalPaid: number;
  interestPaid: number;
  prepaymentPaid: number;
  totalPaidThisMonth: number;
  closingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface PrepaymentComparisonResult {
  originalEmi: number;
  originalTotalInterest: number;
  originalTotalPayment: number;
  originalTenureMonths: number;
  
  newTotalInterest: number;
  newTotalPayment: number;
  newTenureMonths: number;
  interestSaved: number;
  tenureReducedMonths: number;
  newEmiIfEmiReduced: number;
  scheduleWithPrepayment: AmortizationRow[];
  originalSchedule: AmortizationRow[];
}

export interface BalanceTransferResult {
  currentMonthlyEmi: number;
  currentRemainingInterest: number;
  currentRemainingPayment: number;
  
  newMonthlyEmi: number;
  newTotalInterest: number;
  newProcessingFeeAmount: number;
  newTotalPaymentWithFee: number;
  
  netSavings: number;
  monthlySavings: number;
  isViable: boolean;
}

export interface EligibilityResult {
  maxAllowableEmi: number;
  availableEmiCapacity: number;
  maxLoanAmount: number;
  foirPercentage: number;
}

export interface ComparisonScenario {
  id: string;
  label: string;
  amount: number;
  rate: number;
  tenureYears: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}
