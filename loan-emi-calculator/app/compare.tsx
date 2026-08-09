import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { calculateEmi, formatCurrency } from '../utils/calculatorUtils';

export default function CompareScreen() {
  const [loanAmount, setLoanAmount] = useState('2500000');
  const [interestRate, setInterestRate] = useState('8.5');

  const amountVal = parseFloat(loanAmount) || 0;
  const rateVal = parseFloat(interestRate) || 0;

  const tenures = [10, 15, 20, 25, 30];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Compare Loan Tenures</Text>

          <Text style={styles.inputLabel}>Loan Amount (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={loanAmount} onChangeText={setLoanAmount} />

          <Text style={styles.inputLabel}>Interest Rate (% p.a.)</Text>
          <TextInput style={styles.textInput} keyboardType="decimal-pad" value={interestRate} onChangeText={setInterestRate} />
        </View>

        {tenures.map((years) => {
          const emi = calculateEmi(amountVal, rateVal, years * 12);
          const totalPay = emi * years * 12;
          const totalInterest = totalPay - amountVal;

          return (
            <View key={years} style={styles.tenureCard}>
              <View style={styles.tenureHeader}>
                <Text style={styles.tenureTitle}>{years} Years Tenure</Text>
                <Text style={styles.emiVal}>{formatCurrency(emi)}/mo</Text>
              </View>

              <View style={styles.row}>
                <View>
                  <Text style={styles.lbl}>Total Interest</Text>
                  <Text style={styles.valInterest}>{formatCurrency(totalInterest)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.lbl}>Total Repayment</Text>
                  <Text style={styles.valPay}>{formatCurrency(totalPay)}</Text>
                </View>
              </View>
            </View>
          );
        })}
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
  tenureCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  tenureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tenureTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  emiVal: { fontSize: 16, fontWeight: '900', color: '#2563eb' },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8 },
  lbl: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  valInterest: { color: '#dc2626', fontSize: 13, fontWeight: '800', marginTop: 2 },
  valPay: { color: '#0f172a', fontSize: 13, fontWeight: '800', marginTop: 2 },
});
