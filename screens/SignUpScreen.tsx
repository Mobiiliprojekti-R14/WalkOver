// screeens/SignUpScreen.tsx

// Rekisteröinti (username, email, password, confirmPassword)
// 1) Firebase Auth luo käyttäjän (salasana käsitellään turvallisesti palvelimella)
// 2) Firestore transaktio varaa uniikin käyttäjänimen
// - usernames/{usernameLower} -> {uid}
// - users/{uid} -> profiili

import React, { useState } from "react"
import { View, Alert, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Pressable } from "react-native"
import { signUp, SignUpServiceError } from "../src/services/SignUpService"
import { Card, Text, TextInput, Button } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
    onSwitchToLogin: () => void
}

export function SignUpScreen({ onSwitchToLogin }: Props) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // busy: Estää tuplaklikkauksen + näyttää luodaan...
    const [busy, setBusy] = useState(false)

    async function handleSignUp() {
        // Varotoimi: jos pyyntö käynnissä, ei tehdä toista
        if (busy) return

        setBusy(true)

        try {
            // kutsutaan palvelua yhdellä selkeällä input-objektilla
            await signUp({
                username,
                email,
                password,
                confirmPassword,
            })

            // Kun SignUp onnistuu, Firebase Auth kirjauttaa käyttäjän sisään
            // AuthProvider huomaa tämän ja ROotGate siirtää Homeen
            // Ei tarvitse navigointia
        } catch (err: any) {
            // Jos on meidän oma standardi-virhe, näytetään message
            if (err instanceof SignUpServiceError) {
                Alert.alert("Rekisteröinti", err.message)
                return
            }

            // Jos tulee jokin ihan odottamaton virhe, logataan ja näytetään yleinen viesti
            console.log("Yllättävä SignUp virhe:", err)
            Alert.alert("Jotain ihmettä tapahtui... katso console")
        } finally {
            // AINA vapautetaan busy, vaikka tulisi virhe
            setBusy(false)
        }
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled" // Määrittää mitä tapahtuu kosketuksille, kun näppäimistö auki
                    keyboardDismissMode="on-drag"       // Näppäimistö sulkeutuu heti kun käyttäjä alkaa scrollata
                    showsVerticalScrollIndicator={false}  // Piilottaa oikean reunan scroll-palkin
                >
                    <Card style={styles.card} mode="elevated">
                        <Card.Content>
                            <Text variant="headlineSmall" style={styles.title}>
                                Luo tili
                            </Text>
                            <Text variant="bodyMedium" style={styles.subtitle}>
                                Täytä tiedot ja aloitetaan.
                            </Text>

                            <View style={styles.fields}>
                                <TextInput
                                    label="Käyttäjänimi (uniikki)"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                    editable={!busy}
                                    mode="outlined"
                                />

                                <TextInput
                                    label="Sähköposti"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!busy}
                                    mode="outlined"
                                />
                                <TextInput
                                    label="Salasana"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!busy}
                                    mode="outlined"
                                />

                                <TextInput
                                    label="Salasana uudelleen"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    editable={!busy}
                                    mode="outlined"
                                />
                            </View>
                            <Button
                                mode="contained"
                                onPress={handleSignUp}
                                disabled={busy}
                                style={styles.button}
                                contentStyle={styles.buttonContent}
                            >
                                {busy ? "Luodaan..." : "Luo tili"}
                            </Button>

                            <Text variant="bodySmall" style={styles.hint}>
                                Vinkki: käytä vähintään 8 merkkiä salasanassa.
                            </Text>

                            <Text
                                variant="bodyMedium"
                                style={[styles.switchText, busy && styles.disabledText]}
                                onPress={busy ? undefined : onSwitchToLogin}
                            >
                                On jo tili? <Text style={styles.switchTextBold}>Kirjaudu</Text>
                            </Text>


                        </Card.Content>
                    </Card>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F4F5F7" },
    keyboardAvoid: { flex: 1 },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
    },

    card: {
        alignSelf: "center",
        width: "100%",
        maxWidth: 420,
        borderRadius: 16,
    },

    title: { fontWeight: "800" },
    subtitle: { marginTop: 6, marginBottom: 14, opacity: 0.7 },

    fields: {
        gap: 12,
    },

    button: { marginTop: 16, borderRadius: 12 },
    buttonContent: { paddingVertical: 8 },

    hint: {
        marginTop: 12,
        opacity: 0.65,
        textAlign: "center",
    },

    //switchLink: {
    //    marginTop: 12,
    //    alignSelf: "center",
    //},
    switchText: {
        textAlign: "center",
    },
    switchTextBold: {
        fontWeight: "700",
    },
    disabledText: {
        opacity: 0.5,
    }

});