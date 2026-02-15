import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button, Avatar } from 'react-native-paper';
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
                <Text style={styles.tipText}>Näin pelaat WalkOver-peliä
                </Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Tavoite <MaterialIcons name="emoji-events" size={24} color="#ebb00e" /></Text>
                        <Text style={styles.text}>
                            Tervetuloa peliin, jossa jokainen askel merkitsee! Liiku, kerää askeleita ja valloita kaupunginosat itsellesi.{'\n'}{'\n'}
                            Pelin tavoitteena on kerätä askelia alueilla, pelaaja joka on kerännyt askeleita alueella määrällisesti eniten, valoittaa alueen.
                        </Text>
                        <Text style={styles.sectionTitle}>Aloita pelaaminen <MaterialIcons name="location-on" size={24} color="#1c8a2b" /></Text>

                        <Text style={styles.text}>
                            Kun olet valmis liikkumaan, paina etusivulta
                            <Text style={{ fontWeight: 'bold' }}> Aloita pelaaminen </Text>
                            -painiketta. Peli tunnistaa automaattisesti millä alueella olet ja alkaa laskemaan askeleitasi kyseiselle alueelle.{'\n'}
                            Voit vapaasti vaihtaa aluetta liikkuessasi, huomioi kuitenkin että askeleet lasketaan aina sille alueelle jossa niitä kerrytetään.
                            Kartta piirtää kulkemasi reitin reaaliajassa, etusivulta voit myös tarkistella kyseisellä pelikerrallasi kertyneitä askeleita.
                        </Text>

                        <Text style={styles.text}>
                            Pelaaja jolla on hallussaan suurin askelmäärä, valtaa alueen itselleen. Kun valloitat alueen, alue muuttuu kartalla oman profiilivärisi mukaiseksi. Voit tarkastaa oman profiilivärisi<Text style={{ fontWeight: 'bold' }}> etusivulta </Text>oikeassa yläkulmassa olevasta ikonista.
                        </Text>

                        <Text style={styles.text}>
                            Seuraa koko pelialueen tilannetta 
                            <Text style={{ fontWeight: 'bold' }}> Tulostaululta</Text>. 
                            Tulostaululla näet top3 pelaajat, joilla on hallussaan eniten alueita.
                            Aluetilastoista etusivulta pääset tarkastelemaan kyseisen alueen askeltilastoja. Vertaa omaa edistymistäsi muihin pelaajiin ja katso, kuinka paljon askeleita tarvitset seuraavaan sijoitukseen.
                        </Text>

                        <Text style={styles.text}>
                            <Text style={{ fontWeight: 'bold' }}>Profiilissa </Text>
                            näet kaikkien pelikertojesi aikana kertyneet yhteisaskeleet. Täältä pystyt myös vaihtamaan omaa profiiliväriäsi.
                        </Text>
                    </Card.Content>
                </Card>

                <View style={styles.tipContainer}>
                    <MaterialIcons name="lightbulb" size={24} color="#fbc02d" />
                    <Text style={styles.tipTextContent}>
                        <Text style={{ fontWeight: 'bold' }}>Vinkki: </Text>
                        Strategia on yksinkertainen! Mitä enemmän liikut, sitä vaikeampaa muiden on viedä alueitasi.
                        Muista tarkistella aluetilastoja usein, jotta tiedät kuka kärkkyy paikkaasi!
                    </Text>
                </View>

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
        borderRadius: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center'
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    tipContainer: {
        flexDirection: 'row',
        padding: 5,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        width: '90%',
    },
    tipTextContent: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        lineHeight: 22,
    },


})