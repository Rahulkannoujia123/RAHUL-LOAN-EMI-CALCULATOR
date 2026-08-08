import {
  CurrencyConfig,
  CurrencyCode,
  CalculationResult,
  AmortizationRow,
  PrepaymentComparisonResult,
  BalanceTransferResult,
  EligibilityResult
} from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', locale: 'en-IN', formatLakhs: true },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar ($)', locale: 'en-US', formatLakhs: false },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (€)', locale: 'de-DE', formatLakhs: false },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (£)', locale: 'en-GB', formatLakhs: false },
};

/**
 * Format currency amounts nicely with support for Indian Lakhs/Crores notation or standard millions.
 */
export function formatCurrency(amount: number, currency: CurrencyConfig = CURRENCIES.INR, showSymbol = true): string {
  if (isNaN(amount)) return `${currency.symbol}0`;

  const rounded = Math.round(amount);

  if (currency.formatLakhs) {
    // Format Indian Numbering System
    const formatter = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    });
    const formattedStr = formatter.format(rounded);
    return showSymbol ? `${currency.symbol}${formattedStr}` : formattedStr;
  } else {
    const formatter = new Intl.NumberFormat(currency.locale, {
      maximumFractionDigits: 0,
    });
    const formattedStr = formatter.format(rounded);
    return showSymbol ? `${currency.symbol}${formattedStr}` : formattedStr;
  }
}

/**
 * Formats large figures into compact text e.g. ₹25.5 Lakhs or ₹1.2 Cr, or $250K
 */
export function formatCompactCurrency(amount: number, currency: CurrencyConfig = CURRENCIES.INR): string {
  if (isNaN(amount) || amount === 0) return `${currency.symbol}0`;

  if (currency.formatLakhs) {
    if (Math.abs(amount) >= 10000000) {
      return `${currency.symbol}${(amount / 10000000).toFixed(2)} Cr`;
    } else if (Math.abs(amount) >= 100000) {
      return `${currency.symbol}${(amount / 100000).toFixed(2)} Lakh`;
    } else if (Math.abs(amount) >= 1000) {
      return `${currency.symbol}${(amount / 1000).toFixed(1)}k`;
    }
  } else {
    if (Math.abs(amount) >= 1000000000) {
      return `${currency.symbol}${(amount / 1000000000).toFixed(2)}B`;
    } else if (Math.abs(amount) >= 1000006) {
      return `${currency.symbol}${(amount / 1000000).toFixed(2)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `${currency.symbol}${(amount / 1000).toFixed(1)}K`;
    }
  }
  return formatCurrency(amount, currency, true);
}

/**
 * Basic EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEmi(principal: number, annualRatePct: number, totalMonths: number): number {
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (annualRatePct <= 0) return principal / totalMonths;

  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Full Standard Calculation Summary
 */
export function calculateLoanSummary(
  principal: number,
  annualRatePct: number,
  tenureYears: number,
  tenureMonths: number,
  processingFeePct: number = 0
): CalculationResult {
  const totalMonths = tenureYears * 12 + tenureMonths;
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
    ratioInterestPct
  };
}

/**
 * Generate month-by-month Amortization Schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  totalMonths: number,
  startDate: Date = new Date(),
  extraMonthly: number = 0,
  annualLumpSum: number = 0,
  lumpSumMonth: number = 12,
  strategy: 'reduce_tenure' | 'reduce_emi' = 'reduce_tenure'
): AmortizationRow[] {
  if (principal <= 0 || totalMonths <= 0) return [];

  const monthlyRate = annualRatePct / 12 / 100;
  let currentBalance = principal;
  let standardEmi = calculateEmi(principal, annualRatePct, totalMonths);
  let activeEmi = standardEmi;

  const schedule: AmortizationRow[] = [];
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  let monthCount = 1;
  const currentDate = new Date(startDate);

  while (currentBalance > 0.5 && monthCount <= 600) { // max safety cap 50 years
    const yearNumber = Math.ceil(monthCount / 12);
    const openingBalance = currentBalance;
    const interestPaid = Math.round(currentBalance * monthlyRate);
    
    let principalFromEmi = activeEmi - interestPaid;
    if (principalFromEmi > currentBalance) {
      principalFromEmi = currentBalance;
    }

    // Check prepayment for this month
    let prepaymentPaid = 0;
    if (extraMonthly > 0) {
      prepaymentPaid += extraMonthly;
    }

    if (annualLumpSum > 0 && lumpSumMonth > 0 && monthCount % 12 === (lumpSumMonth % 12)) {
      prepaymentPaid += annualLumpSum;
    }

    // Ensure total paid doesn't exceed balance
    if (principalFromEmi + prepaymentPaid > currentBalance) {
      prepaymentPaid = Math.max(0, currentBalance - principalFromEmi);
    }

    const totalPrincipalPaidThisMonth = principalFromEmi + prepaymentPaid;
    const closingBalance = Math.max(0, currentBalance - totalPrincipalPaidThisMonth);

    cumulativeInterest += interestPaid;
    cumulativePrincipal += totalPrincipalPaidThisMonth;

    // Formatting date string
    const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    schedule.push({
      monthNumber: monthCount,
      yearNumber,
      dateStr,
      openingBalance: Math.round(openingBalance),
      emiPaid: Math.round(principalFromEmi + interestPaid),
      principalPaid: Math.round(principalFromEmi),
      interestPaid: Math.round(interestPaid),
      prepaymentPaid: Math.round(prepaymentPaid),
      totalPaidThisMonth: Math.round(principalFromEmi + interestPaid + prepaymentPaid),
      closingBalance: Math.round(closingBalance),
      cumulativeInterest: Math.round(cumulativeInterest),
      cumulativePrincipal: Math.round(cumulativePrincipal)
    });

    currentBalance = closingBalance;

    if (currentBalance <= 0) break;

    // If strategy is reduce_emi and balance was reduced by prepayment, re-calculate EMI for remaining term
    if (strategy === 'reduce_emi' && prepaymentPaid > 0) {
      const remainingMonths = totalMonths - monthCount;
      if (remainingMonths > 0) {
        activeEmi = calculateEmi(currentBalance, annualRatePct, remainingMonths);
      }
    }

    monthCount++;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return schedule;
}

/**
 * Prepayment Comparison Calculation
 */
export function calculatePrepaymentComparison(
  principal: number,
  annualRatePct: number,
  totalMonths: number,
  extraMonthly: number,
  annualLumpSum: number,
  lumpSumMonth: number = 12,
  strategy: 'reduce_tenure' | 'reduce_emi' = 'reduce_tenure'
): PrepaymentComparisonResult {
  const originalEmi = calculateEmi(principal, annualRatePct, totalMonths);
  const originalSchedule = generateAmortizationSchedule(principal, annualRatePct, totalMonths, new Date(), 0, 0);
  const originalTotalInterest = originalSchedule.reduce((sum, r) => sum + r.interestPaid, 0);
  const originalTotalPayment = principal + originalTotalInterest;

  const scheduleWithPrepayment = generateAmortizationSchedule(
    principal,
    annualRatePct,
    totalMonths,
    new Date(),
    extraMonthly,
    annualLumpSum,
    lumpSumMonth,
    strategy
  );

  const newTotalInterest = scheduleWithPrepayment.reduce((sum, r) => sum + r.interestPaid, 0);
  const totalPrepayments = scheduleWithPrepayment.reduce((sum, r) => sum + r.prepaymentPaid, 0);
  const newTotalPayment = principal + newTotalInterest;
  const newTenureMonths = scheduleWithPrepayment.length;
  const interestSaved = Math.max(0, originalTotalInterest - newTotalInterest);
  const tenureReducedMonths = Math.max(0, totalMonths - newTenureMonths);

  let newEmiIfEmiReduced = originalEmi;
  if (strategy === 'reduce_emi' && scheduleWithPrepayment.length > 0) {
    newEmiIfEmiReduced = scheduleWithPrepayment[scheduleWithPrepayment.length - 1].emiPaid;
  }

  return {
    originalEmi,
    originalTotalInterest,
    originalTotalPayment,
    originalTenureMonths: totalMonths,
    newTotalInterest,
    newTotalPayment,
    newTenureMonths,
    interestSaved,
    tenureReducedMonths,
    newEmiIfEmiReduced,
    scheduleWithPrepayment,
    originalSchedule
  };
}

/**
 * Balance Transfer Calculator
 */
export function calculateBalanceTransfer(
  currentBalance: number,
  currentRatePct: number,
  remainingMonths: number,
  newRatePct: number,
  processingFeePct: number,
  newTenureMonths: number = remainingMonths
): BalanceTransferResult {
  const currentMonthlyEmi = calculateEmi(currentBalance, currentRatePct, remainingMonths);
  const currentRemainingPayment = currentMonthlyEmi * remainingMonths;
  const currentRemainingInterest = Math.max(0, currentRemainingPayment - currentBalance);

  const newMonthlyEmi = calculateEmi(currentBalance, newRatePct, newTenureMonths);
  const newTotalInterest = Math.max(0, (newMonthlyEmi * newTenureMonths) - currentBalance);
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
    isViable: netSavings > 0
  };
}

/**
 * Loan Eligibility Calculator (Income based)
 */
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

  // Reverse calculate loan principal from EMI
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
    foirPercentage: foirPct
  };
}
