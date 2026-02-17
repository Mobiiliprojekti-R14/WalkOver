import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAllUserSteps } from "../hooks/useAllUserSteps";
import { PieChart } from "react-native-gifted-charts"
import { calculateTop3 } from "../src/utils/calculateTop3";
import { useAuth } from "../src/auth/AuthProvider";



export function LeaderboardScreen() {
    const { profile } = useAuth()
    const { users, loading } = useAllUserSteps()




    if (loading) {
        return <Text>Ladataan...</Text>;
    }

    const top3 = calculateTop3(users)
    if (!users || users.length === 0) { return <Text>Ei käyttäjiä</Text>; }
    const totalAreas = Object.keys(users[0]).filter(k => k.startsWith("oulu")).length;
    const top1Areas = top3[0]?.controlledAreas ?? 0;
    const top2Areas = top3[1]?.controlledAreas ?? 0;
    const top3Areas = top3[2]?.controlledAreas ?? 0;

    const usedAreas = top1Areas + top2Areas + top3Areas;
    const otherAreas = Math.max(totalAreas - usedAreas, 0);



    const pieData = [
        {
            value: top1Areas,
            color: top3[0]?.userColor ?? "#ffbf00",
            // text: `${top1Areas}`,
            text: "#1",
            label: top3[0]?.displayName || "Top 1"
        },
        {
            value: top2Areas,
            color: top3[1]?.userColor ?? "#c0c0c0",
            // text: `${top2Areas}`,
            text: "#2",
            label: top3[1]?.displayName || "Top 2"
        },
        {
            value: top3Areas,
            color: top3[2]?.userColor ?? "#CD7F32",
            // text: `${top3Areas}`,
            text: "#3",
            label: top3[2]?.displayName || "Top 3"
        },
        {
            value: otherAreas,
            color: '#6f6f6f',
            // text: `${otherAreas}`,
            text: "Loput alueet",
            label: "Muut"
        }
    ];


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
                        {top3.map((u, i) => (
                            <Text key={i}>{i + 1}. {u.displayName} – {u.controlledAreas} aluetta </Text>
                        ))}
                        <Text>{'\n'}</Text>
                        <PieChart
                            data={pieData}
                            showText
                            textColor="white"
                            radius={120}
                            textSize={14}
                        />


                        {/* <Text style={styles.sectionTitle}>Diagrammi 2 {'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text> */}
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