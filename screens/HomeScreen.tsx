// screens/HomeScreen.tsx

import React from "react"
import { View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "../src/auth/AuthProvider"
import { RootGate } from "../src/gates/RootGate"

import MapViewWithLocation from "../components/MapViewWithLocation"

export function HomeScreen() {


    return (
        <View style={{ flex: 1 }}>
            <MapViewWithLocation />
        </View>

    )
}
