// components/settings/ChangePasswordInAppCard.tsx

import React, { useState } from "react"
import { View, Alert, StyleSheet } from "react-native"
import { Text, TextInput, Button } from "react-native-paper"
import { changePasswordInApp } from "../../src/auth/password"

export function ChangePasswordInAppSection() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [busy, setBusy] = useState(false)

    const onSubmit = async () => {
        // 1) UI-validointi
        if (!currentPassword || !newPassword || !repeatPassword) {
            Alert.alert("Täytä kaikki kentät")
            return
        }

        if (newPassword !== repeatPassword) {
            Alert.alert("Salasanat eivät täsmää")
            return
        }

        if (newPassword.length < 8) {
            Alert.alert("Salasana liian lyhyt", "Käytä vähintään 8 merkkiä")
            return
        }

        try {
            setBusy(true)
            await changePasswordInApp(currentPassword, newPassword)

            // Tyhjennetään kentät onnistumisen jälkeen
            setCurrentPassword("")
            setNewPassword("")
            setRepeatPassword("")

            Alert.alert("Salasana vaihdettu")
        } catch (err: any) {
            const code = err?.code ?? "unknown"

            //2 Virheiden mapitus
            if (code === "auth/wrong-password") {
                Alert.alert("Nykyinen salasana on väärä")
            } else if (code === "auth/weak-password") {
                Alert.alert("Uusi salasana on liian heikko")
            } else if (code === "auth/requires-recent-login") {
                Alert.alert(
                    "Kirjaudu uudelleen",
                    "Turvallisuussyistä sinun täytyy kirjautua uudelleen"
                )
            } else if (code === "auth/no-current-user") {
                Alert.alert("Et ole kirjautuneena")
            } else {
                Alert.alert("Epäonnistui", "Salasanan vaihto epäonnistui")
            }
        } finally {
            setBusy(false)
        }
    }

    return (
        <View style={styles.section}>
            <Text variant="titleMedium">Vaihda salasana</Text>

            <TextInput
                mode="outlined"
                label="Nykyinen salasana"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                editable={!busy}
                style={styles.input}
            />

            <TextInput
                mode="outlined"
                label="Uusi salasana"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                editable={!busy}
                style={styles.input}
            />

            <TextInput
                mode="outlined"
                label="Uusi salasana uudelleen"
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                secureTextEntry
                editable={!busy}
                style={styles.input}
            />

            <Button
                mode="outlined"
                onPress={onSubmit}
                loading={busy}
                disabled={busy}
                style={styles.button}
            >
                Vaihda salasana
            </Button>
        </View>
    )
}


const styles = StyleSheet.create({
    section: {
        gap: 10,

    },
    input: {
        marginTop: 10,
    },
    button: {
        marginTop: 16,
    }

})