// screens/HomeScreen.tsx

import React from "react"
import { View, Text, Pressable } from "react-native"
import { signOut } from "firebase/auth"
import { auth } from "../firebase/Config"
import { useAuth } from "../src/auth/AuthProvider"
import MapViewWithLocation from "../components/MapViewWithLocation"

export function HomeScreen() {
    const { user } = useAuth()

    return (
        <MapViewWithLocation />
        /*
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "800" }}>Home </Text>
            <Text>uid: {user?.uid}</Text>
            <Text>email: {user?.email ?? "-"}</Text>

            <Pressable
                onPress={() => signOut(auth)}
                style={{ padding: 12, borderWidth: 1, borderRadius: 10 }}
            >
                <Text>Logout</Text>
            </Pressable>
        </View>
        */
    )
}
