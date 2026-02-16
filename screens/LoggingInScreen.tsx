import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'


export function LoggingInScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.center}>
                <Card mode="elevated" style={styles.card}>
                    <Card.Content>
                        <Text
                            variant="headlineSmall"
                            style={styles.title}
                        >
                            Kirjaudutaan sisään...
                        </Text>


                        <Text
                            variant="bodyMedium"
                            style={styles.subtitle}
                        >
                            Tämä kestää yleensä vain hetken.
                        </Text>

                        <View style={styles.spinnerRow}>
                            <ActivityIndicator />
                            <Text variant="bodyMedium">Ladataan profiilia</Text>

                        </View>
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    card: {
        width: '100%',
        borderRadius: 16
    },
    title: {
        fontWeight: '800',
        marginBottom: 6,
        textAlign: 'center'
    },
    subtitle: {
        opacity: 0.75,
        marginBottom: 14,
        textAlign: 'center'
    },
    spinnerRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
})