// screens/SpalshScreen.tsx

// Näyttö joka näkyy aina käynnistyksessä
// Tämä antaa taustapalveluille aikaa (auth-tila, asetukset ym ym..)

import React from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"



export function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>WalkOver</Text>
            <ActivityIndicator />
            <Text style={styles.subtitle}>Ladataan...</Text>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
    },
    subtitle: {
        color: "#666"
    }
})