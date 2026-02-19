// screens/HomeScreen.tsx

import React from "react"
import { View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "../src/auth/AuthProvider"
import { RootGate } from "../src/gates/RootGate"
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopUpGuideModal from "../components/PopUpGuideModal"

import MapViewWithLocation from "../components/MapViewWithLocation"

export function HomeScreen() {
    const [showTutorial, setShowTutorial] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)

    useEffect(() => {
        const checkTutorial = async () => {
            const disabled = await AsyncStorage.getItem('tutorialDisabled');
            if (!disabled) {
                setShowTutorial(true);
            }
        };
        checkTutorial();
    }, [])

    const closeTutorial = async () => {
        if (dontShowAgain) {
            await AsyncStorage.setItem('tutorialDisabled', 'true')
        }
        setShowTutorial(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <MapViewWithLocation />
            
            <PopUpGuideModal
                    showTutorial={showTutorial}
                    setShowTutorial={setShowTutorial}
                    dontShowAgain={dontShowAgain}
                    setDontShowAgain={setDontShowAgain}
                    closeTutorial={closeTutorial}
                  />
        </View>

    )
}
