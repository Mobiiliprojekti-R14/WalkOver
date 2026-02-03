// src/navigation/AppNavigator
// App-maailma: vain kirjautuneille käyttäjille

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Pressable, Text } from "react-native"

import { HomeScreen } from "../../screens/HomeScreen"
import { MenuScreen } from "../../screens/MenuScreen"
import { AccountMenuScreen } from "../../screens/AccountMenuScreen"

import { useAuth } from "../auth/AuthProvider"
import { getInitials } from "../utils/getInitials"
import { AvatarButton } from "../../components/AvatarButton"


// Valikkosivut
import { DummyTestScreen } from "../../screens/DummyTestScreen"
import { DummySettingsScreen } from "../../screens/DummySettingsScreen"


export type AppStackParamList = {
    Home: undefined
    Menu: undefined
    Profile: undefined
    HowToPlay: undefined
    Settings: undefined
    About: undefined
    AccountMenu: undefined

    // Valikkosivut
    Dummy: undefined


    // Accountsivut
    DummySettings: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

export function AppStackNavigator() {
    return (
        <Stack.Navigator>
            {/* Päänäkymä: kartta */}
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                    title: "Kartta",

                    // "Hamburger" ilman draweria:
                    // Avataan MenuScreen stackin kautta
                    headerLeft: () => (
                        <Pressable
                            onPress={() => navigation.navigate("Menu")}
                            hitSlop={12}
                            style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                        >
                            <Text style={{ fontSize: 28 }}>≡</Text>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <HomeHeaderRight onPress={() => navigation.navigate("AccountMenu")} />

                    ),

                })}
            />

            {/* Menu on "Valikko-ruutu" */}
            <Stack.Screen
                name="Menu"
                component={MenuScreen}
                options={{
                    title: "Valikko",
                    presentation: "modal",

                    //UX: parannus
                    //headerBackTitleVisible: false,
                }}
            />

            {/* Account "menu" */}
            <Stack.Screen
                name="AccountMenu"
                component={AccountMenuScreen}
                options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "fade"
                }}
            />



            {/* Menu-sivut */}
            <Stack.Screen name="Dummy" component={DummyTestScreen} options={{ title: "DummyTesti sivu" }} />


            {/* Account-sivut */}
            <Stack.Screen name="DummySettings" component={DummySettingsScreen} options={{ title: "DummySettings sivu" }} />

        </Stack.Navigator>
    )
}

function HomeHeaderRight({ onPress }: { onPress: () => void }) {
    const { profile } = useAuth()

    const initial = getInitials({
        displayName: profile?.displayName,
        username: profile?.username,
        email: profile?.email,
    })


    return <AvatarButton initial={initial} onPress={onPress} />
}