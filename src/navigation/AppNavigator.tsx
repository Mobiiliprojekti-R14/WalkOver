// src/navigation/AppNavigator
// App-maailma: vain kirjautuneille käyttäjille

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Pressable, Text, StyleSheet } from "react-native"


import { HomeScreen } from "../../screens/HomeScreen"
import { MenuScreen } from "../../screens/MenuScreen"
import { AccountMenuScreen } from "../../screens/AccountMenuScreen"
import { ProfileScreen } from "../../screens/ProfileScreen"
import { LeaderboardScreen } from "../../screens/LeaderboardScreen"
import { InstructionsScreen } from "../../screens/InstructionsScreen"

import { useAuth } from "../auth/AuthProvider"
import { getInitials } from "../utils/getInitials"
import { AvatarButton } from "../../components/AvatarButton"


// Valikkosivut
import { DummyTestScreen } from "../../screens/DummyTestScreen"
import { Testisivu } from "../../screens/Testisivu"


// Käyttäjän sivut
import { UserSettingsScreen } from "../../screens/UserSettingsScreen"


export type AppStackParamList = {
    Home: undefined
    Menu: undefined
    Profile: undefined
    HowToPlay: undefined
    About: undefined
    AccountMenu: undefined

    // Valikkosivut
    Dummy: undefined
    Testisivu: undefined
    Profiili: undefined
    Tulostaulu: undefined
    Peliohje: undefined


    // Accountsivut
    Settings: undefined
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
                    animation: "fade",
                    
                }}
            />



            {/* Menu-sivut */}
            <Stack.Screen name="Dummy" component={DummyTestScreen} options={{ title: "DummyTesti sivu" }} />
            <Stack.Screen name="Testisivu" component={Testisivu} options={{ title: "Testisivu2" }} />
            <Stack.Screen name="Profiili" component={ProfileScreen} options={{ title: "Profiili" }} />
            <Stack.Screen name="Tulostaulu" component={LeaderboardScreen} options={{ title: "Tulostaulu" }} />
            <Stack.Screen name="Peliohje" component={InstructionsScreen} options={{ title: "Peliohje" }} />

            {/* Account-sivut */}
            <Stack.Screen name="Settings" component={UserSettingsScreen} options={{ title: "Asetukset" }} />

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


const styles = StyleSheet.create({

})