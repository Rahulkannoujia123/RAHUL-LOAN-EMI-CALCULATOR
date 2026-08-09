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

export function formatCurrency(amount: number, symbol: string = '₹'): string {
  if (isNaN(amount)) return `${symbol}0`;
  const rounded = Math.round(amount);
  const formattedStr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(rounded);
  return `${symbol}${formattedStr}`;
}

export function calculateEmi(principal: number, annualRatePct: number, totalMonths: number): number {
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (annualRatePct <= 0) return Math.round(principal / totalMonths);

  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

export function calculateLoanSummary(
  principal: number,
  annualRatePct: number,
  tenureYears: number,
  processingFeePct: number = 0
): CalculationResult {
  const totalMonths = tenureYears * 12;
  const monthlyEmi = calculateEmi(principal, annualRatePct, totalMonths);
  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const totalProcessingFee = Math.round((principal * processingFeePct) / 100);

  const totalSum = principal + totalInterest;
  const ratioPrincipalPct = totalSum > 0 ? Number(((principal / totalSum) * 100).toFixed(1)) : 100;
  const ratioInterestPct = totalSum > 0 ? Number(((totalInterest / totalSum) * 100).toFixed(1)) : 0;

  return {
    monthlyEmi,
    principalAmount: principal,
    totalInterest,
    totalProcessingFee,
    totalPayment,
    ratioPrincipalPct,
    ratioInterestPct,
  };
}

export function calculatePrepaymentComparison(
  principal: number,
  annualRatePct: number,
  totalMonths: number,
  extraMonthly: number,
  annualLumpSum: number
): PrepaymentComparisonResult {
  const originalEmi = calculateEmi(principal, annualRatePct, totalMonths);
  const monthlyRate = annualRatePct / 12 / 100;

  let balance = principal;
  let months = 0;
  let totalInterestWithPrepay = 0;

  while (balance > 0.5 && months < 600) {
    months++;
    const interestPaid = balance * monthlyRate;
    let principalPaid = originalEmi - interestPaid;
    if (principalPaid > balance) principalPaid = balance;

    let prepay = extraMonthly;
    if (annualLumpSum > 0 && months % 12 === 0) prepay += annualLumpSum;

    if (principalPaid + prepay > balance) prepay = Math.max(0, balance - principalPaid);

    totalInterestWithPrepay += interestPaid;
    balance -= (principalPaid + prepay);
  }

  const originalTotalPayment = originalEmi * totalMonths;
  const originalTotalInterest = originalTotalPayment - principal;

  const newTotalPayment = principal + totalInterestWithPrepay;
  const interestSaved = Math.max(0, originalTotalInterest - totalInterestWithPrepay);
  const tenureReducedMonths = Math.max(0, totalMonths - months);

  return {
    originalEmi,
    originalTotalInterest,
    originalTotalPayment,
    originalTenureMonths: totalMonths,
    newTotalInterest: Math.round(totalInterestWithPrepay),
    newTotalPayment: Math.round(newTotalPayment),
    newTenureMonths: months,
    interestSaved: Math.round(interestSaved),
    tenureReducedMonths,
    newEmiIfEmiReduced: originalEmi,
  };
}

export function calculateBalanceTransfer(
  currentBalance: number,
  currentRatePct: number,
  remainingMonths: number,
  newRatePct: number,
  processingFeePct: number
): BalanceTransferResult {
  const currentMonthlyEmi = calculateEmi(currentBalance, currentRatePct, remainingMonths);
  const currentRemainingPayment = currentMonthlyEmi * remainingMonths;
  const currentRemainingInterest = Math.max(0, currentRemainingPayment - currentBalance);

  const newMonthlyEmi = calculateEmi(currentBalance, newRatePct, remainingMonths);
  const newTotalInterest = Math.max(0, (newMonthlyEmi * remainingMonths) - currentBalance);
  const newProcessingFeeAmount = Math.round((currentBalance * processingFeePct) / 100);
  const newTotalPaymentWithFee = currentBalance + newTotalInterest + newProcessingFeeAmount;

  const netSavings = Math.round(currentRemainingPayment - newTotalPaymentWithFee);
  const monthlySavings = Math.round(currentMonthlyEmi - newMonthlyEmi);

  return {
    currentMonthlyEmi,
    currentRemainingInterest,
    currentRemainingPayment,
    newMonthlyEmi,
    newTotalInterest,
    newProcessingFeeAmount,
    newTotalPaymentWithFee,
    netSavings,
    monthlySavings,
    isViable: netSavings > 0,
  };
}

export function calculateEligibility(
  grossMonthlyIncome: number,
  existingEmis: number,
  foirPct: number = 50,
  annualRatePct: number = 8.5,
  tenureYears: number = 20
): EligibilityResult {
  const maxAllowableEmi = Math.round((grossMonthlyIncome * foirPct) / 100);
  const availableEmiCapacity = Math.max(0, maxAllowableEmi - existingEmis);
  const totalMonths = tenureYears * 12;

  let maxLoanAmount = 0;
  if (availableEmiCapacity > 0) {
    const monthlyRate = annualRatePct / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    maxLoanAmount = Math.round((availableEmiCapacity * (factor - 1)) / (monthlyRate * factor));
  }

  return {
    maxAllowableEmi,
    availableEmiCapacity,
    maxLoanAmount,
    foirPercentage: foirPct,
  };
}
