import React, { useState, useMemo } from 'react';
import { CurrencyConfig, AmortizationRow } from '../types';
import {
  generateAmortizationSchedule,
  formatCurrency,
  formatCompactCurrency
} from '../utils/calculatorUtils';
import { Calendar, Download, Printer, Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface AmortizationTableProps {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  tenureMonths: number;
  currency: CurrencyConfig;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  loanAmount,
  interestRate,
  tenureYears,
  tenureMonths,
  currency
}) => {
  const totalMonths = tenureYears * 12 + tenureMonths;

  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

  const schedule = useMemo(() => {
    return generateAmortizationSchedule(loanAmount, interestRate, totalMonths);
  }, [loanAmount, interestRate, totalMonths]);

  // Group by Year for Yearly View
  const yearlyGroups = useMemo(() => {
    const groups: Record<
      number,
      {
        yearNumber: number;
        principalPaid: number;
        interestPaid: number;
        totalPaid: number;
        closingBalance: number;
        rows: AmortizationRow[];
      }
    > = {};

    schedule.forEach((row) => {
      if (!groups[row.yearNumber]) {
        groups[row.yearNumber] = {
          yearNumber: row.yearNumber,
          principalPaid: 0,
          interestPaid: 0,
          totalPaid: 0,
          closingBalance: row.closingBalance,
          rows: [],
        };
      }

      groups[row.yearNumber].principalPaid += row.principalPaid + row.prepaymentPaid;
      groups[row.yearNumber].interestPaid += row.interestPaid;
      groups[row.yearNumber].totalPaid += row.totalPaidThisMonth;
      groups[row.yearNumber].closingBalance = row.closingBalance;
      groups[row.yearNumber].rows.push(row);
    });

    return Object.values(groups);
  }, [schedule]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Month',
      'Date',
      'Opening Balance',
      'EMI',
      'Principal Paid',
      'Interest Paid',
      'Closing Balance',
      'Cumulative Interest'
    ];

    const rows = schedule.map((r) => [
      r.monthNumber,
      r.dateStr,
      r.openingBalance,
      r.emiPaid,
      r.principalPaid,
      r.interestPaid,
      r.closingBalance,
      r.cumulativeInterest
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Loan_Amortization_Schedule_${loanAmount}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  const toggleYear = (yearNum: number) => {
    setExpandedYears((prev) => ({ ...prev, [yearNum]: !prev[yearNum] }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Amortization Schedule & Payment Timeline
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Month-by-month principal drop and interest accumulation breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'yearly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly View
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            CSV
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            Print
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[11px] tracking-wider border-b border-gray-200">
            <tr>
              <th className="p-3.5">Term</th>
              <th className="p-3.5">Principal Paid</th>
              <th className="p-3.5">Interest Paid</th>
              <th className="p-3.5">Total Payment</th>
              <th className="p-3.5">Balance Remaining</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-mono">
            {viewMode === 'yearly'
              ? yearlyGroups.map((group) => {
                  const isExpanded = expandedYears[group.yearNumber];
                  return (
                    <React.Fragment key={group.yearNumber}>
                      <tr
                        onClick={() => toggleYear(group.yearNumber)}
                        className="bg-white hover:bg-blue-50/50 cursor-pointer transition-all"
                      >
                        <td className="p-3.5 font-extrabold text-gray-900 flex items-center gap-2 font-sans">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                          Year {group.yearNumber}
                        </td>
                        <td className="p-3.5 text-blue-600 font-bold">
                          {formatCurrency(group.principalPaid, currency)}
                        </td>
                        <td className="p-3.5 text-rose-600 font-bold">
                          {formatCurrency(group.interestPaid, currency)}
                        </td>
                        <td className="p-3.5 text-gray-900 font-bold">
                          {formatCurrency(group.totalPaid, currency)}
                        </td>
                        <td className="p-3.5 font-extrabold text-gray-900">
                          {formatCurrency(group.closingBalance, currency)}
                        </td>
                      </tr>

                      {/* Expandable Monthly Rows */}
                      {isExpanded &&
                        group.rows.map((r) => (
                          <tr key={r.monthNumber} className="bg-gray-50/70 text-[11px] text-gray-600">
                            <td className="p-2.5 pl-8 font-sans font-medium">
                              Mo {r.monthNumber} ({r.dateStr})
                            </td>
                            <td className="p-2.5 text-blue-700 font-semibold">{formatCurrency(r.principalPaid, currency)}</td>
                            <td className="p-2.5 text-rose-700 font-semibold">{formatCurrency(r.interestPaid, currency)}</td>
                            <td className="p-2.5 text-gray-800 font-semibold">{formatCurrency(r.totalPaidThisMonth, currency)}</td>
                            <td className="p-2.5 text-gray-900 font-bold">{formatCurrency(r.closingBalance, currency)}</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })
              : schedule.map((r) => (
                  <tr key={r.monthNumber} className="hover:bg-blue-50/50 transition-all">
                    <td className="p-3.5 font-sans font-medium text-gray-900">
                      Mo {r.monthNumber} ({r.dateStr})
                    </td>
                    <td className="p-3.5 text-blue-600 font-bold">
                      {formatCurrency(r.principalPaid, currency)}
                    </td>
                    <td className="p-3.5 text-rose-600 font-bold">
                      {formatCurrency(r.interestPaid, currency)}
                    </td>
                    <td className="p-3.5 text-gray-800 font-semibold">
                      {formatCurrency(r.totalPaidThisMonth, currency)}
                    </td>
                    <td className="p-3.5 font-bold text-gray-900">
                      {formatCurrency(r.closingBalance, currency)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
