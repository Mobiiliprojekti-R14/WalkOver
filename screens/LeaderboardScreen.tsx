import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAllUserSteps } from "../hooks/useAllUserSteps";
import { PieChart } from "react-native-gifted-charts"
import { calculateTop3 } from "../src/utils/calculateTop3";




export function LeaderboardScreen() {
    
    const { users, loading } = useAllUserSteps()




    // Boolean, on true jos lataus on valmis, users ei ole null ja käyttäjiä on vähintään 1
    const hasUsers = !loading && users && users.length > 0;
    // Jos käyttäjiä on -> laske top3, muuten anna tyhjä lista
    const top3 = hasUsers ? calculateTop3(users) : [];
    // Jos käyttäjiä on -> laske kuinka monta ouluX-fieldiä käyttäjällä on, jos ei löydy niin palauta 0 fieldiä
    const totalAreas = hasUsers ? Object.keys(users[0]).filter(k => k.startsWith("oulu")).length : 0;

    // Top1-3 käyttäjät hallittujen alueiden määrien mukaan
    const top1Areas = top3[0]?.controlledAreas ?? 0;
    const top2Areas = top3[1]?.controlledAreas ?? 0;
    const top3Areas = top3[2]?.controlledAreas ?? 0;

    // Laskutoimitus, jotta saadaan piirakkadiagrammiin top3 sekä muut alueet
    const usedAreas = top1Areas + top2Areas + top3Areas;
    const otherAreas = Math.max(totalAreas - usedAreas, 0);
    
    const trophyColors = ["#ebb00e", "#b9b1b1", "#c4874a"]



    const pieData = [
        {
            value: top1Areas,
            color: top3[0]?.userColor ?? "#ffbf00",
            text: "#1",
            label: top3[0]?.displayName || "Top 1",
            fontWeight: 'bold'
        },
        {
            value: top2Areas,
            color: top3[1]?.userColor ?? "#c0c0c0",
            text: "#2",
            label: top3[1]?.displayName || "Top 2",
            fontWeight: 'bold'
        },
        {
            value: top3Areas,
            color: top3[2]?.userColor ?? "#CD7F32",
            text: "#3",
            label: top3[2]?.displayName || "Top 3",
            fontWeight: 'bold'
        },
        {
            value: otherAreas,
            color: '#6f6f6fb4',
            text: "Loput alueet",
            label: "Muut",
            fontWeight: 'bold'
        }
    ];


    const insets = useSafeAreaInsets()
    return (

        <View style={[styles.container, { paddingBottom: insets.bottom }]}>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 }
                ]}
            >
                <Text style={styles.welcomeText}>Hall Of Fame</Text>
                <Text style={styles.tipText}>Tarkistele pelin tilastoja</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Pelin TOP 3:</Text>
                        {top3.map((u, i) => (
                            <Text key={i}>
                                <MaterialIcons name="emoji-events" size={25} color={trophyColors[i]} />#
                                {i + 1}: {u.displayName} – {u.controlledAreas} aluetta </Text>
                        ))}
                        <Text>{'\n'}</Text>
                        <PieChart
                            data={pieData}
                            showText
                            textColor="white"
                            radius={120}
                            textSize={14}
                            labelsPosition="outward"
                        />

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
        fontSize: 23,
        marginBottom: 10,
        marginTop: 20,
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
        textAlign: 'center',
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 10,
    }

})