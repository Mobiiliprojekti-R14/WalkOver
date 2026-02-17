// components/ConquestDonutCard.tsx

import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { PieChart } from "react-native-gifted-charts"

import { useAuth } from "../src/auth/AuthProvider"
import { useAllUserSteps } from "../hooks/useAllUsersSteps"
import { calculateConquestStats } from "../src/utils/calculateConquestStats"

/**
 * Profiilisivun donut:
 * - Donut kuvaa: mun alueet vs muu kartta
 * - Keskellä: mun omistus% koko kartasta (kokonaislukuna)
 * - Alla: lisäinfot (mun alueet, vallatut, valloittamattomat)
 */

export function ConquestDonutCard() {
    // Hookit aina ensin, aina samassa järjestyksessä
    const { profile } = useAuth()
    const { users, loading } = useAllUserSteps()

    const myUsername = profile?.username ?? undefined

    // useMemo on myös hook → sen pitää tapahtua aina
    const stats = React.useMemo(() => {
        // Jos data puuttuu, palautetaan "nolla-statsit"
        // (ei tehdä early returnia ennen hookkeja)
        if (!users || users.length === 0) {
            return {
                totalAreas: 0,
                conqueredAreas: 0,
                unconqueredAreas: 0,
                ownedAreasByMe: 0,
                myPct: 0
            }
        }

        return calculateConquestStats(users, myUsername)
    }, [users, myUsername])

    // Nyt vasta conditional renderöinti
    if (loading) return <Text>Ladataan alueita...</Text>
    if (!users || users.length === 0) return <Text>Ei dataa vielä</Text>
    if (stats.totalAreas === 0) return <Text>Ei alueita määritelty</Text>

    const myColor = profile?.userColor ?? "#2196F3"
    const otherAreas = Math.max(stats.totalAreas - stats.ownedAreasByMe, 0)

    const pieData = [
        { value: stats.ownedAreasByMe, color: myColor },
        { value: otherAreas, color: "#E0E0E0" }
    ]

    return (
        <View style={styles.card}>
            <Text style={styles.title}>MINUN ALUEET</Text>
            <Text style={styles.subtitle}>Osuus koko kartasta</Text>

            <View style={styles.chartContainer}>
                <PieChart
                    data={pieData}
                    donut
                    radius={90}
                    innerRadius={60}
                    showText={false}
                    centerLabelComponent={() => (
                        <View style={styles.centerLabel}>
                            <Text style={styles.percentText}>{stats.myPct}%</Text>
                        </View>
                    )}
                />
            </View>

            <View style={styles.infoSection}>
                <View style={styles.myRow}>
                    <View style={[styles.colorDot, { backgroundColor: myColor }]} />
                    <Text style={styles.infoText}>
                        Minun alueet: {stats.ownedAreasByMe} / {stats.totalAreas}
                    </Text>
                </View>

                <Text style={styles.infoText}>
                    Vallattuja: {stats.conqueredAreas} / {stats.totalAreas}
                </Text>

                <Text style={styles.infoText}>
                    Valloittamattomia: {stats.unconqueredAreas} / {stats.totalAreas}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: { padding: 20, borderRadius: 16, backgroundColor: "#fff", elevation: 3, marginVertical: 12 },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    subtitle: {
        fontSize: 12,
        color: "#666",
        marginBottom: 16,
        textAlign: "center",
    },
    chartContainer: { alignItems: "center", marginVertical: 10 },
    centerLabel: { alignItems: "center", justifyContent: "center" },
    percentText: { fontSize: 28, fontWeight: "bold" },
    infoSection: { marginTop: 12, alignItems: "center" },
    infoText: {
        fontSize: 16,
        marginVertical: 4,
        fontWeight: 400,
    },
    myRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 }
})