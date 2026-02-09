import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react"
import { StyleSheet, Text, View, Button } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/auth/AuthProvider';
import { RootGate } from './src/gates/RootGate';
import { PaperProvider } from 'react-native-paper';


export default function App() {

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <RootGate />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});