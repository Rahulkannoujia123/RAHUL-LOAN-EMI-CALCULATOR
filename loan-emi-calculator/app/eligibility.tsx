import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { calculateEligibility, formatCurrency } from '../utils/calculatorUtils';

export default function EligibilityScreen() {
  const [grossIncome, setGrossIncome] = useState('100000');
  const [existingEmis, setExistingEmis] = useState('15000');
  const [foirPct, setFoirPct] = useState('50');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');

  const incomeVal = parseFloat(grossIncome) || 0;
  const emisVal = parseFloat(existingEmis) || 0;
  const foirVal = parseFloat(foirPct) || 50;
  const rateVal = parseFloat(interestRate) || 8.5;
  const tenureVal = parseFloat(tenureYears) || 20;

  const result = calculateEligibility(incomeVal, emisVal, foirVal, rateVal, tenureVal);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Loan Eligibility Calculator</Text>

          <Text style={styles.inputLabel}>Gross Monthly Income (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={grossIncome} onChangeText={setGrossIncome} />

          <Text style={styles.inputLabel}>Existing Monthly EMIs (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={existingEmis} onChangeText={setExistingEmis} />

          <Text style={styles.inputLabel}>Allowed FOIR Limit (%)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={foirPct} onChangeText={setFoirPct} />

          <Text style={styles.inputLabel}>Expected Interest Rate (%)</Text>
          <TextInput style={styles.textInput} keyboardType="decimal-pad" value={interestRate} onChangeText={setInterestRate} />

          <Text style={styles.inputLabel}>Tenure (Years)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={tenureYears} onChangeText={setTenureYears} />
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.tag}>MAXIMUM ELIGIBLE LOAN</Text>
          <Text style={styles.amount}>{formatCurrency(result.maxLoanAmount)}</Text>
          <Text style={styles.subText}>Based on FOIR FOIR limit of {foirPct}%</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.lbl}>Max Allowable EMI</Text>
              <Text style={styles.val}>{formatCurrency(result.maxAllowableEmi)}/mo</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.lbl}>Available Capacity</Text>
              <Text style={styles.val}>{formatCurrency(result.availableEmiCapacity)}/mo</Text>
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
  resultCard: { backgroundColor: '#d97706', borderRadius: 24, padding: 20 },
  tag: { color: '#fef3c7', fontSize: 11, fontWeight: '800' },
  amount: { color: '#ffffff', fontSize: 32, fontWeight: '900', marginTop: 4 },
  subText: { color: '#fffbeb', fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f59e0b', marginVertical: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  lbl: { color: '#fef3c7', fontSize: 11 },
  val: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginTop: 2 },
});
