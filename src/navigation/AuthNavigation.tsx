// src/navigation/AuthNavigation

// Kaikki ennen sisäänpääsyä

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthScreen } from "../../screens/AuthScreen"

export type AuthStackParamList = {
    Auth: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{
                headerShown: false // AuthScreen hoitaa oman UI:n
            }}
        >
            <Stack.Screen name="Auth" component={AuthScreen} />

        </Stack.Navigator>
    )
}