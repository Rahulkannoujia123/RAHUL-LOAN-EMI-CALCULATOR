/**
 * Generates React Native code structure and Expo APK build instructions.
 */

export const REACT_NATIVE_APP_CODE = `import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [loanAmount, setLoanAmount] = useState('2500000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');
  const [currency, setCurrency] = useState('₹');

  // Calculation logic
  const P = parseFloat(loanAmount) || 0;
  const R = (parseFloat(interestRate) || 0) / 12 / 100;
  const N = (parseFloat(tenureYears) || 0) * 12;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (P > 0 && R > 0 && N > 0) {
    const factor = Math.pow(1 + R, N);
    emi = Math.round((P * R * factor) / (factor - 1));
    totalPayment = emi * N;
    totalInterest = totalPayment - P;
  }

  const formatCurrency = (val) => {
    return currency + ' ' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EMI Calculator Pro</Text>
          <Text style={styles.headerSub}>Smart Loan & Payment Planner</Text>
        </View>

        {/* Currency Switcher */}
        <View style={styles.currencyRow}>
          {['₹', '$', '€', '£'].map((curr) => (
            <TouchableOpacity
              key={curr}
              style={[styles.currencyBtn, currency === curr && styles.currencyBtnActive]}
              onPress={() => setCurrency(curr)}>
              <Text style={[styles.currencyText, currency === curr && styles.currencyTextActive]}>
                {curr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Input */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Loan Amount ({currency})</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={loanAmount}
            onChangeText={setLoanAmount}
            placeholder="e.g. 25,00,000"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.inputLabel}>Interest Rate (% per annum)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="e.g. 8.5"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.inputLabel}>Loan Tenure (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={tenureYears}
            onChangeText={setTenureYears}
            placeholder="e.g. 20"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Results Card */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Monthly EMI</Text>
          <Text style={styles.resultEmi}>{formatCurrency(emi)}</Text>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.statLabel}>Principal Amount</Text>
              <Text style={styles.statValue}>{formatCurrency(P)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>Total Interest</Text>
              <Text style={[styles.statValue, { color: '#f43f5e' }]}>
                {formatCurrency(totalInterest)}
              </Text>
            </View>
          </View>

          <View style={[styles.rowBetween, { marginTop: 16 }]}>
            <View>
              <Text style={styles.statLabel}>Total Repayment</Text>
              <Text style={styles.statValueHighlight}>{formatCurrency(totalPayment)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>Tenure</Text>
              <Text style={styles.statValue}>{N} Months ({tenureYears} Yrs)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContainer: { padding: 20 },
  header: { marginBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#ffffff' },
  headerSub: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  currencyRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 },
  currencyBtn: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, backgroundColor: '#1e293b' },
  currencyBtnActive: { backgroundColor: '#3b82f6' },
  currencyText: { color: '#94a3b8', fontWeight: '600' },
  currencyTextActive: { color: '#ffffff' },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 20 },
  inputLabel: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#0f172a', borderRadius: 10, padding: 14, color: '#ffffff', fontSize: 16, borderWidth: 1, borderColor: '#334155' },
  resultCard: { backgroundColor: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#4338ca' },
  resultTitle: { color: '#a5b4fc', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  resultEmi: { color: '#ffffff', fontSize: 36, fontWeight: '800', marginTop: 6, marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#3730a3', marginVertical: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: '#a5b4fc', fontSize: 12 },
  statValue: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginTop: 2 },
  statValueHighlight: { color: '#38bdf8', fontSize: 18, fontWeight: '800', marginTop: 2 },
});
`;

export const PACKAGE_JSON_CODE = `{
  "name": "emi-calculator-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}`;

export function downloadFile(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
