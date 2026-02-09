import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export function InstructionsScreen() {

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

                <Text style={styles.welcomeText}>Peliohjeet</Text>
                <Text style={styles.tipText}>Näin pelaat WalkOver-peliä</Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Tavoite</Text>
                        <Text style={styles.text}>
                            Aloita pelaaminen keräämällä askelia alueilla ja valtaa alueet keräämällä suurimmat askelmäärät. {'\n'}
                            Oman profiilivärisi näet oikealla ylhäällä olevasta ikonista, alue muuttuu profiilivärisi mukaiseksi kun olet valoittanut alueen.
                        </Text>
                        <Text style={styles.sectionTitle}>Ohje 2</Text>
                        <Text style={styles.text}>
                            - Jotaki
                            {'\n'}
                            - Jotaki
                        </Text>
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
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingTop: 30,
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: 20,
    },
    welcomeText: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center'
    },
    tipText: {
        fontSize: 18,
        marginBottom: 50,
        textAlign: 'center'
    },
    card: {
        width: '90%',
        elevation: 4,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 20,
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


})