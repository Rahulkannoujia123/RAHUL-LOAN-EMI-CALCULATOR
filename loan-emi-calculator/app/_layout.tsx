import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#2563eb" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'EMIPro - Loan Calculator',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="prepayment"
          options={{
            title: 'Prepayment Savings',
          }}
        />
        <Stack.Screen
          name="transfer"
          options={{
            title: 'Balance Transfer',
          }}
        />
        <Stack.Screen
          name="eligibility"
          options={{
            title: 'Loan Eligibility',
          }}
        />
        <Stack.Screen
          name="compare"
          options={{
            title: 'Compare Tenures',
          }}
        />
        <Stack.Screen
          name="advisor"
          options={{
            title: 'AI Financial Advisor',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
