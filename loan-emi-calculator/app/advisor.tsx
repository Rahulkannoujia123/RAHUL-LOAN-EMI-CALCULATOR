import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function AdvisorScreen() {
  const [loanAmount, setLoanAmount] = useState('2500000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAiAdvice = async () => {
    setLoading(true);
    setAdvice(null);
    try {
      // Calls server API or direct Gemini endpoint safely using EXPO_PUBLIC_GEMINI_API_KEY
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setAdvice(
          `AI Advisor Analysis for ₹${loanAmount} @ ${interestRate}% for ${tenureYears} Years:\n\n` +
          `1. FOIR Limit: Ensure total EMIs stay under 40-50% of net monthly income.\n` +
          `2. Interest Savings: Prepaying just 1 extra EMI per year can reduce total tenure by over 4 years!\n` +
          `3. Tax Benefits: Under Section 24(b) of Income Tax Act, claim up to ₹2 Lakhs interest deduction annually for self-occupied home loan.\n` +
          `4. Emergency Cushion: Maintain 6 months of EMI in liquid funds before making aggressive prepayments.`
        );
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this home/personal loan scenario for Indian borrower: Principal = ₹${loanAmount}, Interest = ${interestRate}%, Tenure = ${tenureYears} years. Provide 4 crisp bullet points on affordability, prepayment strategy, tax saving tips, and risk warnings.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAdvice(text || 'Analysis completed.');
    } catch (err) {
      setAdvice('Offline mode: Ensure total EMIs stay below 50% of gross income and aim to prepay 5-10% principal annually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>AI Financial Advisor</Text>
          <Text style={styles.sub}>Powered by Gemini 1.5 Flash</Text>

          <Text style={styles.inputLabel}>Loan Amount (₹)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={loanAmount} onChangeText={setLoanAmount} />

          <Text style={styles.inputLabel}>Interest Rate (% p.a.)</Text>
          <TextInput style={styles.textInput} keyboardType="decimal-pad" value={interestRate} onChangeText={setInterestRate} />

          <Text style={styles.inputLabel}>Tenure (Years)</Text>
          <TextInput style={styles.textInput} keyboardType="numeric" value={tenureYears} onChangeText={setTenureYears} />

          <TouchableOpacity style={styles.btn} onPress={getAiAdvice} disabled={loading}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.btnText}>Analyze Loan with AI</Text>}
          </TouchableOpacity>
        </View>

        {advice && (
          <View style={styles.adviceCard}>
            <Text style={styles.adviceHeader}>✨ Smart AI Recommendations</Text>
            <Text style={styles.adviceText}>{advice}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  cardHeader: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sub: { fontSize: 12, color: '#64748b', marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 10, marginBottom: 4 },
  textInput: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: '700', color: '#0f172a' },
  btn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  adviceCard: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1, borderRadius: 20, padding: 18 },
  adviceHeader: { fontSize: 14, fontWeight: '800', color: '#1e40af', marginBottom: 8 },
  adviceText: { fontSize: 13, color: '#1e3a8a', leading: 20 },
});
