// screens/MenuScreen.tsx
// Valikko (vasen "drawer-fiilis") NativeStack
// Ei omia Firestore hakuja täällä
// Profiilidata tulee yhdestä paikasta: AuthProvider (useAuth)
// Taustan painallus sulkee valikon
// LogOut -> signOut(auth) -> RootGate tiputtaa Authiin

//import React, { useEffect, useState } from "react"
import { View, Text, Pressable, StyleSheet, Alert, Dimensions, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { AppStackParamList } from "../src/navigation/AppNavigator"

import { signOut } from "firebase/auth"
import { auth } from "../firebase/Config"
import { useAuth } from "../src/auth/AuthProvider"



type Props = NativeStackScreenProps<AppStackParamList, "Menu">

export function MenuScreen({ navigation }: Props) {

    const insets = useSafeAreaInsets()

    const { user, profile, profileLoading } = useAuth()

    async function handleLogout() {
        try {
            await signOut(auth)
            // RootGate reagoi -> tiputtaa Authiin
        } catch (e) {
            console.warn("Logout failed:", e)
            Alert.alert("Virhe", "Uloskirjautuminen epäonnistui")
        }
    }

    // Jos jostain syystä Menua aukeaa ilman useria, ei näytetä mitään (turvacheck)
    if (!user) return null

    // Puolileveä (max 420) - Pitäsi näyttää valikolta myös tabletilla (vaikka ei kyllä kukaan pelaa tätä tabletilla)
    const screenW = Dimensions.get("window").width
    const panelW = Math.min(420, Math.round(screenW * 0.72)) // leveys ~72% ruudusta

    return (
        <View style={styles.root}>
            {/* Overlay: painamalla taustaa suljetaan valikko */}
            <Pressable
                style={[styles.backDrop, { bottom: insets.bottom }]}
                onPress={() => navigation.goBack()}
            />

            {/* Vasemman reunan paneeli */}
            <View style={[styles.panel,
            {
                width: panelW,
                paddingTop: 1 + insets.top,
                paddingBottom: 12,
                marginBottom: insets.bottom // paneeli loppuu enen nav baria
            }
            ]}
            >
                {/*Paneeli-header*/}
                <View style={styles.panelHeader}>
                    <Text style={styles.panelTitle}>Valikko</Text>

                    {/*Sulje nappi */}
                    <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </Pressable>
                </View>


                {/* Menu items */}
                <MenuItem title="Dummy sivu" onPress={() => navigation.navigate("Dummy")} />
                <MenuItem title="Testisivu" onPress={() => navigation.navigate("Testisivu")} />

                <View style={styles.divider} />

                <MenuItem title="Kirjaudu ulos" onPress={handleLogout} danger />
            </View>
        </View >
    )
}

function MenuItem({
    title,
    onPress,
    danger,
}: {
    title: string
    onPress: () => void
    danger?: boolean
}) {
    return (
        <Pressable onPress={onPress} style={styles.item} hitSlop={6}>
            <Text style={[styles.itemText, danger && styles.dangerText]}>{title}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({

    root: {
        flex: 1,
        // overlay toimii kun root täyttää koko ruudun
    },
    backDrop: {
        ...StyleSheet.absoluteFillObject,
        // tumma tausta, joka antaa drawer fiiliksen
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    panel: {
        flex: 1,
        backgroundColor: "#ffff",
        paddingTop: 12,
        paddingHorizontal: 14,
        // kortti-fiilis
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8, // Android-shadow
    },
    panelHeader: {
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    panelTitle: {
        fontSize: 18,
        fontWeight: "800",
    },
    closeIcon: {
        fontSize: 18,
    },
    userCard: {
        marginTop: 8,
        marginBottom: 10,
        padding: 12,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
    },
    userName: {
        fontSize: 16,
        fontWeight: "700",
    },
    userEmail: {
        marginTop: 4,
        fontSize: 13,
        opacity: 0.8,
    },
    userHandle: { marginTop: 6, fontSize: 13, opacity: 0.8 },
    item: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 16,
    },
    dangerText: {
        fontWeight: "800",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginVertical: 14,
    },



})