import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export function LeaderboardScreen() {

    const insets = useSafeAreaInsets()
    return (

        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {/*<View style={[styles.header, { paddingTop: insets.top }]}>
                <Button
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
                <Text style={styles.welcomeText}>Hall Of Fame</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Pelin TOP 3:</Text>
                        <Text style={styles.text}>
                            - Pelaaja 1
                            {'\n'}
                            - Pelaaja 2
                            {'\n'}
                            - Pelaaja 3
                            {'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}
                        </Text>

                        <Text style={styles.sectionTitle}>Diagrammi 2 {'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text>
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
        elevation: 2,
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
    welcomeText: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 50,
        marginTop: 20,
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
    }

})