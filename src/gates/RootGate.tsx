// src/gates/RootGate.tsx

// Sovelluksen boot-gate
// Keskittää splash + auth + init-logiikan yhteen paikkaan

import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"

import { useAuth } from "../auth/AuthProvider"
import { SplashScreen } from "../../screens/SplashScreen"
import { AuthScreen } from "../../screens/AuthScreen"
import { HomeScreen } from "../../screens/HomeScreen"

export function RootGate() {
    const { user, loading } = useAuth()

    // Splashin minimiaika (UX)
    const [minTime, setMinTime] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTime(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    // Näytetään Splash kunnes:
    // - auth-tila on tiedossa
    // - ja minimiaika täynnä
    if (loading || !minTime) {
        return <SplashScreen />
    }

    // Tässä kohtaa tiedetään mihin mennään
    if (!user) return <AuthScreen />
    return <HomeScreen />

}