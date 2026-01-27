import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react"
import { StyleSheet, Text, View, Button } from 'react-native';

import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { RootGate } from './src/gates/RootGate';


export default function App() {

  return (
    <AuthProvider>
      <RootGate />
    </AuthProvider>
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