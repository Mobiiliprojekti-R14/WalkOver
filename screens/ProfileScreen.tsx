import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button, Checkbox, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "../src/auth/AuthProvider";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { doc, updateDoc } from "firebase/firestore"
import { db, COLLECTIONS } from "../firebase/Config"

import {
    getAccentHexFromProfile,
    getColorName,
    generateProfileColor,
    getAccentHex,
} from "../src/theme/colorsPalette";


export function ProfileScreen() {
    const { user, profile } = useAuth()
    const insets = useSafeAreaInsets()
    const [checked, setChecked] = useState(false)

    const displayName = profile?.displayName || "Käyttäjä"
    //const userColor = profile?.userColor || '#4682B4'

    //Haetaan cells taulukko joka sisältää arvot oulu1-oulu16 askeleet
    const cells = profile?.cells || Array(16).fill(0)
    //Lasketaan taulukon luvuista summa
    const totalSteps = cells.reduce((sum, current) => sum + (Number(current) || 0), 0)

    // Nykyinen profiiliväri hexinä (tai null jos ei valittu)
    const accentHex = profile?.userColor ?? getAccentHexFromProfile(profile?.colorFamily, profile?.colorVariant)

    // Profiilivärin nimi (tai null jos ei valittu)
    const colorName = profile?.colorFamily ? getColorName(profile.colorFamily) : null

    async function onGenerateColor() {
        // 1) turvatarkistus: pitää olla kirjautunut user + profile
        if (!user || !profile) return

        // 2) Arvotaan uusi väri, mutta ei samaa kuin nykyinen
        const { family, variant } = generateProfileColor(
            profile.colorFamily,
            profile.colorVariant
        )

        const hex = getAccentHex(family, variant)

        // 3) Päivitetään Firestoreen (null -> HasColor)
        const ref = doc(db, COLLECTIONS.USERS, user.uid)
        await updateDoc(ref, {
            colorFamily: family,
            colorVariant: variant,
            userColor: hex,
        })

        // UX: checkbox pois päältä
        setChecked(false)
    }

    return (

        <View style={[styles.container, { paddingBottom: insets.bottom }]}>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 }
                ]}
            >
                <Text style={styles.user}>{displayName}</Text>
                <Text style={styles.welcomeText}> oma profiilisivu </Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Aktiivisuutesi:{'\n'}{'\n'}DIAGRAMMI 1{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text>
                        <Text style={styles.text}>Aktiivisuutesi tällä hetkellä:</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.stepsCounter}>
                                <MaterialIcons
                                    name="directions-walk"
                                    size={28}
                                    style={accentHex ? { color: accentHex } : undefined}
                                //style={accentHex ? { backgroundColor: accentHex } : undefined}
                                />
                                <Text style={styles.statNumber}>{totalSteps}</Text>
                                <Text style={styles.statLabel}>Askeleet yhteensä</Text>
                            </View>
                        </View>
                        <Text style={styles.sectionTitle}>DIAGRAMMI 2 {'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text>


                        <View style={styles.generatorSection}>
                            <View style={styles.controlsColumn}>
                                <View style={styles.checkboxRow}>
                                    <Checkbox
                                        status={checked ? 'checked' : 'unchecked'}
                                        onPress={() => setChecked(!checked)}
                                        color="black"
                                    />
                                    <Text style={styles.checkboxLabel} onPress={() => setChecked(!checked)}>
                                        Generoi uusi profiiliväri
                                    </Text>
                                </View>
                                <Button
                                    mode="contained"
                                    buttonColor="black"
                                    onPress={onGenerateColor}
                                    style={styles.generateButton}
                                    disabled={!checked} // Nappi on himmeä jos ei ruksia
                                >
                                    Generoi
                                </Button>
                            </View>
                            <View style={styles.avatarContainer}>
                                <Avatar.Text
                                    size={40}
                                    // Ottaa nimen ensimmäisen kirjaimen
                                    label={displayName.charAt(0).toUpperCase()}
                                    style={accentHex ? { backgroundColor: accentHex } : undefined}
                                />
                                <Text style={styles.colorName}>
                                    {colorName ?? "EI PROFIILIVÄRIÄ"}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        marginLeft: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: 20,
    },
    user: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 20,
        textAlign: 'center'
    },
    welcomeText: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 40,
        textAlign: 'center'
    },
    card: {
        width: '90%',
        elevation: 4,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center'
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    statsRow: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: '#fcfcfc',
        borderRadius: 20,
        marginVertical: 10,
        shadowColor: '#000',
        elevation: 5,
    },
    stepsCounter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statNumber: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textTransform: 'uppercase',
    },
    generatorSection: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 20,
    },
    controlsColumn: {
        flex: 1,
        flexDirection: 'column',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: -8,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    generateButton: {
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    avatarContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorName: {
        paddingTop: 10,
    }

})