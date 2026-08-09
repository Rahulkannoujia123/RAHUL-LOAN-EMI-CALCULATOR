import React, { useState } from 'react';
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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { calculateLoanSummary, formatCurrency } from '../utils/calculatorUtils';

const { width } = Dimensions.get('window');

const LOAN_TYPES = [
  { id: 'home', name: 'Home Loan', amount: 3500000, rate: 8.5, tenure: 20, fee: 0.5 },
  { id: 'personal', name: 'Personal Loan', amount: 500000, rate: 12.5, tenure: 4, fee: 1.0 },
  { id: 'car', name: 'Car Loan', amount: 800000, rate: 9.0, tenure: 5, fee: 0.5 },
  { id: 'education', name: 'Education Loan', amount: 1500000, rate: 10.0, tenure: 7, fee: 0.0 },
  { id: 'business', name: 'Business Loan', amount: 2000000, rate: 14.0, tenure: 5, fee: 1.5 },
];

export default function MainEmiScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('home');
  const [loanAmount, setLoanAmount] = useState('3500000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');
  const [processingFeePct, setProcessingFeePct] = useState('0.5');

  const amountVal = parseFloat(loanAmount) || 0;
  const rateVal = parseFloat(interestRate) || 0;
  const tenureVal = parseFloat(tenureYears) || 0;
  const feeVal = parseFloat(processingFeePct) || 0;

  const result = calculateLoanSummary(amountVal, rateVal, tenureVal, feeVal);

  const handleSelectPreset = (preset: typeof LOAN_TYPES[0]) => {
    setSelectedType(preset.id);
    setLoanAmount(preset.amount.toString());
    setInterestRate(preset.rate.toString());
    setTenureYears(preset.tenure.toString());
    setProcessingFeePct(preset.fee.toString());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      
      {/* Mobile Top Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>EMIPro</Text>
        <Text style={styles.appSubtitle}>Smart Loan & Financial Planner</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Loan Type Category Selector */}
        <Text style={styles.sectionLabel}>SELECT LOAN CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {LOAN_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => handleSelectPreset(type)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Feature Navigation Tabs */}
        <View style={styles.featureGrid}>
          <TouchableOpacity style={styles.featureBtn} onPress={() => router.push('/prepayment')}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureBtnText}>Prepayment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBtn} onPress={() => router.push('/transfer')}>
            <Text style={styles.featureIcon}>🔄</Text>
            <Text style={styles.featureBtnText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBtn} onPress={() => router.push('/eligibility')}>
            <Text style={styles.featureIcon}>💡</Text>
            <Text style={styles.featureBtnText}>Eligibility</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBtn} onPress={() => router.push('/compare')}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureBtnText}>Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBtn} onPress={() => router.push('/advisor')}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureBtnText}>AI Advisor</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Loan Details</Text>

          <Text style={styles.inputLabel}>Loan Amount (₹ INR)</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            value={loanAmount}
            onChangeText={setLoanAmount}
            placeholder="e.g. 35,00,000"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.inputLabel}>Interest Rate (% p.a.)</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="decimal-pad"
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="e.g. 8.5"
            placeholderTextColor="#94a3b8"
          />

          <View style={styles.rowTwo}>
            <View style={styles.colHalf}>
              <Text style={styles.inputLabel}>Tenure (Years)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={tenureYears}
                onChangeText={setTenureYears}
                placeholder="20"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <View style={styles.colHalf}>
              <Text style={styles.inputLabel}>Processing Fee (%)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                value={processingFeePct}
                onChangeText={setProcessingFeePct}
                placeholder="0.5"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>

        {/* Output EMI Result Card */}
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>Monthly EMI</Text>
          <Text style={styles.emiAmount}>{formatCurrency(result.monthlyEmi)}</Text>
          <Text style={styles.emiSubtext}>per month for {tenureVal * 12} months</Text>

          <View style={styles.divider} />

          <View style={styles.statRow}>
            <View>
              <Text style={styles.statLabel}>Principal Loan</Text>
              <Text style={styles.statValue}>{formatCurrency(result.principalAmount)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>Total Interest</Text>
              <Text style={[styles.statValue, { color: '#f43f5e' }]}>
                {formatCurrency(result.totalInterest)}
              </Text>
            </View>
          </View>

          <View style={[styles.statRow, { marginTop: 14 }]}>
            <View>
              <Text style={styles.statLabel}>Processing Fee ({processingFeePct}%)</Text>
              <Text style={styles.statValue}>{formatCurrency(result.totalProcessingFee)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>Total Payable</Text>
              <Text style={styles.statHighlight}>{formatCurrency(result.totalPayment)}</Text>
            </View>
          </View>

          {/* Breakdown progress bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${result.ratioPrincipalPct}%`, backgroundColor: '#2563eb' }]} />
            <View style={[styles.progressBar, { width: `${result.ratioInterestPct}%`, backgroundColor: '#f43f5e' }]} />
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>🔵 Principal ({result.ratioPrincipalPct}%)</Text>
            <Text style={styles.legendText}>🔴 Interest ({result.ratioInterestPct}%)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureBtn: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: (width - 48) / 5,
  },
  featureIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  featureBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colHalf: {
    width: '48%',
  },
  resultCard: {
    backgroundColor: '#2563eb',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  resultHeader: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emiAmount: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 4,
  },
  emiSubtext: {
    color: '#dbeafe',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#60a5fa',
    marginVertical: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: '#bfdbfe',
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  statHighlight: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 18,
    backgroundColor: '#1e40af',
  },
  progressBar: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendText: {
    color: '#dbeafe',
    fontSize: 10,
    fontWeight: '700',
  },
});
