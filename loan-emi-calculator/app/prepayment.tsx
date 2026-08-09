import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { calculatePrepaymentComparison, formatCurrency } from '../utils/calculatorUtils';

export default function PrepaymentScreen() {
  const [loanAmount, setLoanAmount] = useState('2500000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');
  const [extraMonthly, setExtraMonthly] = useState('5000');
  const [annualLumpSum, setAnnualLumpSum] = useState('50000');

  const amountVal = parseFloat(loanAmount) || 0;
  const rateVal = parseFloat(interestRate) || 0;
  const tenureVal = parseFloat(tenureYears) || 0;
  const extraVal = parseFloat(extraMonthly) || 0;
  const lumpVal = parseFloat(annualLumpSum) || 0;

  const result = calculatePrepaymentComparison(amountVal, rateVal, tenureVal * 12, extraVal, lumpVal);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Prepayment Savings Calculator</Text>

          <Text style={styles.inputLabel}>Current Principal Loan Amount (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={loanAmount} onChangeText={setLoanAmount} />

          <Text style={styles.inputLabel}>Interest Rate (% p.a.)</Text>
          <TextInput style={styles.textInput} keyboardType="decimal-pad" value={interestRate} onChangeText={setInterestRate} />

          <Text style={styles.inputLabel}>Remaining Tenure (Years)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={tenureYears} onChangeText={setTenureYears} />

          <Text style={styles.inputLabel}>Extra Monthly Prepayment (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={extraMonthly} onChangeText={setExtraMonthly} />

          <Text style={styles.inputLabel}>Annual Lump Sum Prepayment (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={annualLumpSum} onChangeText={setAnnualLumpSum} />
        </View>

        {/* Savings Summary Card */}
        <View style={styles.savingsCard}>
          <Text style={styles.savingsTag}>INTEREST SAVINGS</Text>
          <Text style={styles.savingsAmount}>{formatCurrency(result.interestSaved)}</Text>
          <Text style={styles.savingsSub}>
            Tenure reduced by {Math.floor(result.tenureReducedMonths / 12)} yrs {result.tenureReducedMonths % 12} mos!
          </Text>

          <View style={styles.rowTwo}>
            <View style={styles.col}>
              <Text style={styles.miniLabel}>Original Interest</Text>
              <Text style={styles.miniVal}>{formatCurrency(result.originalTotalInterest)}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.miniLabel}>New Interest</Text>
              <Text style={styles.miniValHighlight}>{formatCurrency(result.newTotalInterest)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  cardHeader: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 10, marginBottom: 4 },
  textInput: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: '700', color: '#0f172a' },
  savingsCard: { backgroundColor: '#16a34a', borderRadius: 24, padding: 20 },
  savingsTag: { color: '#dcfce7', fontSize: 11, fontWeight: '800' },
  savingsAmount: { color: '#ffffff', fontSize: 32, fontWeight: '900', marginTop: 4 },
  savingsSub: { color: '#f0fdf4', fontSize: 12, fontWeight: '600', marginTop: 2, marginBottom: 16 },
  rowTwo: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#4ade80', paddingTop: 14 },
  col: { width: '48%' },
  miniLabel: { color: '#dcfce7', fontSize: 11 },
  miniVal: { color: '#ffffff', fontSize: 14, fontWeight: '800', marginTop: 2 },
  miniValHighlight: { color: '#ffffff', fontSize: 15, fontWeight: '900', marginTop: 2 },
});
