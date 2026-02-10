import React, { useState } from 'react'
import { Alert, View, StyleSheet } from "react-native"
import { Button, Card, Dialog, Portal, Text, TextInput } from "react-native-paper"

import { deleteAccountWithPassword } from '../../src/auth/account'



export function DeleteAccountSection() {

    const [visible, setVisible] = useState(false)
    const [password, setPassword] = useState("")
    const [busy, setBusy] = useState(false)


    const open = () => {
        // Avataan dialogi ja tyhjennetään kenttä
        // UX: turvallinen ja selkeä
        setPassword("")
        setVisible(true)
    }

    const close = () => {
        if (busy) return
        setVisible(false)
    }

    const onDelete = async () => {
        if (!password) {
            Alert.alert("Syötä salasana", "Vahvista tilin poisto syöttämällä nykyinen salasana")
            return
        }

        try {
            setBusy(true)

            // Poistetaan tili re-authin kautta
            // Firebase vaatii recent-Login varmistuksen
            await deleteAccountWithPassword(password)

            // Kun delete onnistuu, käyttäjä on poistettu Authista.


            Alert.alert("Tili poistettu", "Tilisi on poistettu onnistuneesti.")
            setVisible(false)

        } catch (err: any) {
            const code = err?.code ?? "unknown"

            // Virhemapitus
            if (code === "auht/wrong-password") {
                Alert.alert("Väärä salasana", "Syöttämäsi salasana ei ole oikein")
            } else if (code === "auth/requires-recent-login") {
                Alert.alert(
                    "Kirjaudu uudelleen",
                    "Turvallisuussyistä sinun täytyy kirjautua uudelleen ennen tilin poistamista"
                )
            } else if (code === "auth/no-current-user") {
                Alert.alert("Et ole kirjautuneena", "Kirjaudu sisään ja yritä uudelleen.")
            } else {
                Alert.alert("Epäonnistui", "Tili poisto epäonnistui. Yritä uudelleen")
            }
        } finally {
            setBusy(false)
        }
    }

    return (
        <>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.cardContent}>
                        <Text variant="titleMedium">Tilin Poisto</Text>

                        <Text variant="bodySmall">
                            Huomio!! Tilin poisto on pysyvä
                        </Text>

                        <Button mode="contained" onPress={open} disabled={busy}>
                            Poista tili.
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            {/* Dialogi erillään Portalin kautta */}
            <Portal>
                <Dialog visible={visible} onDismiss={close}>
                    <Dialog.Title>Poista tili</Dialog.Title>

                    <Dialog.Content>
                        <Text variant="bodyMedium" style={styles.dialogContent}>
                            Vahvista tilin poisto syöttämällä nykyinen salasanasi
                        </Text>

                        <TextInput
                            mode="outlined"
                            label="Nykyinen salasana"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!busy}
                        />
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button onPress={close} disabled={busy}>
                            Peru
                        </Button>
                        <Button onPress={onDelete} loading={busy} disabled={busy}>
                            Poista pysyvästi
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    )
}


const styles = StyleSheet.create({
    card: {
        padding: 12
    },
    cardContent: {
        gap: 12,
    },
    dialogContent: {},
})
