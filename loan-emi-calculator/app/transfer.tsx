import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { calculateBalanceTransfer, formatCurrency } from '../utils/calculatorUtils';

export default function TransferScreen() {
  const [currentBalance, setCurrentBalance] = useState('2000000');
  const [currentRate, setCurrentRate] = useState('9.5');
  const [remainingTenure, setRemainingTenure] = useState('15');
  const [newRate, setNewRate] = useState('8.3');
  const [processingFee, setProcessingFee] = useState('0.5');

  const balVal = parseFloat(currentBalance) || 0;
  const oldRateVal = parseFloat(currentRate) || 0;
  const monthsVal = (parseFloat(remainingTenure) || 0) * 12;
  const newRateVal = parseFloat(newRate) || 0;
  const feeVal = parseFloat(processingFee) || 0;

  const result = calculateBalanceTransfer(balVal, oldRateVal, monthsVal, newRateVal, feeVal);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Balance Transfer Calculator</Text>

          <Text style={styles.inputLabel}>Current Outstanding Principal (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={currentBalance} onChangeText={setCurrentBalance} />

          <Text style={styles.inputLabel}>Current Rate (% p.a.)</Text>
          <TextInput style={styles.textInput} keyboardType="decimal-pad" value={currentRate} onChangeText={setCurrentRate} />

          <Text style={styles.inputLabel}>New Offered Rate (% p.a.)</Text>
          <TextInput style={styles.textInput} keyboardType="decimal-pad" value={newRate} onChangeText={setNewRate} />

          <Text style={styles.inputLabel}>Remaining Tenure (Years)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={remainingTenure} onChangeText={setRemainingTenure} />

          <Text style={styles.inputLabel}>New Processing Fee (%)</Text>
          <TextInput style={styles.textInput} keyboardType="decimal-pad" value={processingFee} onChangeText={setProcessingFee} />
        </View>

        <View style={[styles.resultCard, { backgroundColor: result.isViable ? '#2563eb' : '#dc2626' }]}>
          <Text style={styles.tag}>{result.isViable ? 'RECOMMENDED TRANSFER' : 'NOT VIABLE'}</Text>
          <Text style={styles.amount}>{formatCurrency(result.netSavings)}</Text>
          <Text style={styles.subText}>Net Savings after Processing Fees</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.lbl}>Current EMI</Text>
              <Text style={styles.val}>{formatCurrency(result.currentMonthlyEmi)}/mo</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.lbl}>New EMI</Text>
              <Text style={styles.val}>{formatCurrency(result.newMonthlyEmi)}/mo</Text>
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
  resultCard: { borderRadius: 24, padding: 20 },
  tag: { color: '#bfdbfe', fontSize: 11, fontWeight: '800' },
  amount: { color: '#ffffff', fontSize: 32, fontWeight: '900', marginTop: 4 },
  subText: { color: '#dbeafe', fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#60a5fa', marginVertical: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  lbl: { color: '#bfdbfe', fontSize: 11 },
  val: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginTop: 2 },
});
