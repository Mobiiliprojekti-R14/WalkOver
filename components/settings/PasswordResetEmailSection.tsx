import React, { useMemo, useState } from "react"
import { Alert, View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"
import { sendPasswordResetLink } from "../../src/auth/password"
import { getAuth } from "firebase/auth"


export function PasswordResetEmailSection() {

    const auth = getAuth()
    const user = auth.currentUser

    const [busy, setBusy] = useState(false)
    const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)

    const cooldownActive = useMemo(() => {
        if (!cooldownUntil) return false
        return Date.now() < cooldownUntil
    }, [cooldownUntil])

    const email = user?.email ?? null

    async function onSendPasswordReset() {
        if (!user) {
            Alert.alert("Et ole kirjautuneena", "Kirjaudu sisään ja yritä uudelleen")
            return
        }
        if (!email) {
            Alert.alert(
                "Sähköposti puuttuu",
                "Tällä tilillä ei ole sähköpostiosoitetta. Salasanan vaihto sähköpostilla ei onnistu."
            )
            return
        }
        if (cooldownActive) return

        Alert.alert(
            "Lähetä salasananvaihtolinkki?",
            `Lähetetään linkki osoitteeseen:\n${email}`,
            [
                { text: "Peru", style: "cancel" },
                {
                    text: "Lähetä",
                    onPress: async () => {
                        try {
                            setBusy(true)
                            await sendPasswordResetLink(email)
                            setCooldownUntil(Date.now() + 60_000)

                            Alert.alert(
                                "Linkki lähetetty",
                                "Tarkista sähköposti. Jos viestiä ei näy, tarkista myös roskaposti."
                            )
                        } catch (err: any) {
                            const code = err?.code ?? "unknown"

                            if (code === "auth/too-many-requests") {
                                Alert.alert("Liikaa pyyntöjä", "Yritä hetken päästä uudelleen.")
                            } else if (code === "auth/invalid-email") {
                                Alert.alert("Virheellinen sähköposti", "Tarkista sähköpostiosoite.")
                            } else {
                                Alert.alert("Epäonnistui", "Linkin lähetys epäonnistui. Yritä uudelleen.")
                            }
                        } finally {
                            setBusy(false)
                        }
                    },
                },
            ]
        )
    }

    return (
        <View style={styles.section}>
            <Text variant="titleMedium">Vaihda salasana sähköpostilla</Text>

            <Text variant="bodySmall">Sähköposti: {email ?? "—"}</Text>

            <Button
                mode="outlined"
                onPress={onSendPasswordReset}
                disabled={busy || cooldownActive || !email}
                loading={busy}
            >
                Lähetä salasananvaihtolinkki
            </Button>

            {cooldownActive && (
                <Text variant="bodySmall">Voit lähettää uuden linkin hetken kuluttua.</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    section: { gap: 10 },
})
