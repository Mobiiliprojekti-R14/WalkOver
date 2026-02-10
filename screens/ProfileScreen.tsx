import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button, Checkbox, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "../src/auth/AuthProvider";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export function ProfileScreen() {
    const { profile } = useAuth()
    const displayName = profile?.displayName || "Käyttäjä"


    const insets = useSafeAreaInsets()

    const [checked, setChecked] = useState(false)

    const userColor = profile?.userColor || '#4682B4'

    //Alustetaan summa nollaksi
    let totalSteps = 0

    //Käydään läpi numerot 1-16
    for (let i = 1; i <= 16; i++) {
        const steps = `oulu${i}`
        const value = profile ? (profile as any)[steps] : 0

        //Lisätään summaan, jos löytyy arvo
        totalSteps += Number(value) || 0
    }

    return (

        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {/*<View style={[styles.header, { paddingTop: insets.top }]}>*/}
            {/*<Button
                            style={styles.backButton}
                            onPress={() => console.log('Takaisin')}
                        >
                            <MaterialIcons name="arrow-back" size={30} color="black" />
                        </Button>
                    </View>*/}

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
                                <MaterialIcons name="directions-walk" size={28} color={userColor} />
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
                                    onPress={() => console.log('generoitu')}
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
                                    style={{ backgroundColor: userColor }}
                                />
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
    }

})