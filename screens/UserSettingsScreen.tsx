import React from 'react'
import { View, StyleSheet, ScrollView } from "react-native"


import { SettingsSecuritySection } from '../components/settings/SettingsSecuritySection'
import { DeleteAccountSection } from '../components/settings/DeleteAccountSection'

import { SafeAreaView } from 'react-native-safe-area-context'

export function UserSettingsScreen() {
    return (

        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <SettingsSecuritySection />
                <DeleteAccountSection />
            </ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        padding: 16,
        gap: 16,
        paddingBottom: 32,
    },

})