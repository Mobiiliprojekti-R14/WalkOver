import React from "react"
import { View, StyleSheet } from "react-native"
import { Card, Text, Divider } from "react-native-paper"
import { ChangePasswordInAppSection } from "./ChangePasswordInAppSection"
import { PasswordResetEmailSection } from "./PasswordResetEmailSection"

export function SettingsSecuritySection() {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.content}>
                    <Text variant="titleMedium">Turvallisuus</Text>

                    <ChangePasswordInAppSection />

                    <Divider style={styles.divider} />

                    <PasswordResetEmailSection />
                </View>
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
    },
    content: {
        gap: 16,
    },
    divider: {
        marginVertical: 16,
        
    },
})
