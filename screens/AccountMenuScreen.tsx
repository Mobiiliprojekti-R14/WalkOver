import React from "react"
import { View, Text, Pressable, StyleSheet, Alert, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { signOut } from "firebase/auth"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { AppStackParamList } from "../src/navigation/AppNavigator"
import { useAuth } from "../src/auth/AuthProvider"
import { auth } from "../firebase/Config"




type Props = NativeStackScreenProps<AppStackParamList, "AccountMenu">

export function AccountMenuScreen({ navigation }: Props) {

    const { profile, profileLoading } = useAuth()
    const insets = useSafeAreaInsets()

    async function handleLogOut() {
        try {
            await signOut(auth)
        } catch (e) {
            console.warn("Uloskirjautuminen epäonnistui:", e)
            Alert.alert("Virhe", "Uloskirjautuminen epäonnistui")
        }
    }

    const screenW = Dimensions.get("window").width
    const panelW = Math.min(420, Math.round(screenW * 0.72))

    return (
        <View style={styles.root}>
            {/* Taustan klikkaus sulkee valikon*/}
            <Pressable
                style={[styles.backDrop, { bottom: insets.bottom }]}
                onPress={() => navigation.goBack()}
            />

            {/*Paneeli oikealle*/}
            <View style={[styles.panel,
            {
                width: panelW,
                //paddingTop: 1 + insets.top,
                marginTop: 1 + insets.top,
                paddingBottom: 12,
                marginBottom: insets.bottom // paneeli loppuu enen nav baria

            }]}>
                <View style={styles.panelHeader}>
                    <Text style={styles.panelTitle}>Tili</Text>

                    {/* Sulje nappi */}
                    <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
                        <Text style={styles.closeIcon}>X</Text>
                    </Pressable>
                </View>

                {/* KÄyttäjätiedot */}
                <View style={styles.userCard}>
                    <Text style={styles.username}>
                        {profileLoading ? "Haetaan..." : profile?.displayName ?? "Käyttäjä"}
                    </Text>
                    <Text style={styles.userEmail}>{profile?.email ?? "--"}</Text>

                    {/* Jos halutaan myös username */}
                    {profile?.username ? (
                        <Text style={styles.userHandle}>@{profile.username}</Text>
                    ) : null}
                </View>

                <MenuItem title="Profiili" onPress={() => navigation.navigate("Profile")} />
                <MenuItem title="Asetukset" onPress={() => navigation.navigate("Settings")} />


                <View style={styles.divider} />

                <MenuItem title="Kirjaudu ulos" onPress={handleLogOut} danger />
            </View>
        </View>
    )
}

function MenuItem({
    title,
    onPress,
    danger,
}: {
    title: string
    onPress: () => void,
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
        //flexDirection: "row",
    },
    backDrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)"
    },
    panel: {
        marginLeft: "auto", // työntää paneellin oikealle
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 12,
        paddingHorizontal: 14,
        elevation: 8,
        shadowOpacity: 0.25,
        shadowRadius: 10,

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
    username: { fontSize: 16, fontWeight: "700" },
    userEmail: { marginTop: 4, fontSize: 13, opacity: 0.8 },
    userHandle: { marginTop: 6, fontSize: 13, opacity: 0.8 },
    divider: { height: StyleSheet.hairlineWidth, marginVertical: 14 },
    item: {
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    itemText: { fontSize: 16 },
    dangerText: { fontWeight: "800" },
})