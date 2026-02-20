// src/gates/RootGate.tsx

// Sovelluksen boot-gate
// Keskittää splash + auth + init-logiikan yhteen paikkaan
// MUUTOS: palautetaan NavigationContainer + (AuthNavigator | AppNavigator)

import React, { useEffect, useState } from "react"

import { NavigationContainer } from "@react-navigation/native"
import { AppStackNavigator } from "../navigation/AppNavigator"


import { useAuth } from "../auth/AuthProvider"
import { SplashScreen } from "../../screens/SplashScreen"
import { FinishingAccountScreen } from "../../screens/FinishingAccountScreen"
import { LoggingInScreen } from "../../screens/LoggingInScreen"

import { doc, onSnapshot } from "firebase/firestore"
import { db, COLLECTIONS } from "../../firebase/Config"


import { AuthNavigator } from "../navigation/AuthNavigation"


export function RootGate() {
    const { user, loading } = useAuth()

    // profiilin olemassaolo (users/uid)
    const [profileReady, setProfileReady] = useState(false)

    // Splashin minimiaika (UX)
    const [minTime, setMinTime] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMinTime(true), 2000)
        return () => clearTimeout(timer)
    })

    useEffect(() => {
        // Jos ei useria, ei profiilia
        if (!user) {
            setProfileReady(false)
            return
        }

        // Kuunnellaan users/{uid} dokkaria:
        // - heti kun se ilmestyy, snap.exists() -> true -> profileReady true -> Home/AppNavigator
        const userRef = doc(db, COLLECTIONS.USERS, user.uid)

        const unsub = onSnapshot(
            userRef,
            (snap) => {
                setProfileReady(snap.exists())
            },
            (err) => {
                console.log("Profiilin snapshot error", err)
                setProfileReady(false)
            }
        )

        return () => unsub()
    }, [user])

    // Näytetään Splash kunnes:
    // - auth tila on tiedossa
    // - ja minimiaika täynnä
    if (loading || !minTime) {
        return <SplashScreen />
    }

   if (user && !profileReady) {
    //Lasketaan onko käyttäjä juuri luotu
    const isNewUser = 
        new Date().getTime() - new Date(user.metadata.creationTime!).getTime() < 10000

    if (isNewUser) {
        console.log ('rekisteröitymisikkuna')
        return <FinishingAccountScreen /> //"Viimeistellään tiliä..."
    } else {
        console.log ('kirjautumisikkuna')
        return <LoggingInScreen />//"Kirjaudutaan sisään..."
    }
}

    // Navigointi:
    // - ei useria -> AuthNavigator
    // - user + profiili ok -> AppStackNavigator

    return (
        <NavigationContainer>
            {user ? <AppStackNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}