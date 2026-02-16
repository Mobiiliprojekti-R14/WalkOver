import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../src/auth/AuthProvider'

export default function StepsInCell({ cellNumber }: { cellNumber: number }) {
    const { profile } = useAuth()
    
    
    let isInsideCell = false
    

    if(cellNumber >= 1 && cellNumber <=16){
        isInsideCell = true
    }
    
    
  return (
  <View style={styles.container}>
    {!isInsideCell ? (
      <Text style={styles.stepsText}>Et ole pelialueella</Text>
    ) : (
      <Text style={styles.stepsText}>Askelmääräsi tällä alueella: {profile ? profile.cells[cellNumber-1] ?? "Käyttäjä" : "Haetaan..."}</Text>
    )}
  </View>
)
}

const styles = StyleSheet.create({
    container: {
    alignItems: "center"
    },

    stepsText: {
        fontSize: 16,
    }
})