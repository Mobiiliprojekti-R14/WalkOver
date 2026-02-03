//componets/AppBar.tsx
// Yleinen AppBar-komponetti (UI)
// Saa otsikon ja "avaa drawer"

import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"

type AppBarProps = {
    title: string
    onPressMenu: () => void
    right?: React.ReactNode // tulevaisuutta varten
}

export function AppBar({ title, onPressMenu, right }: AppBarProps) {
    return (
        <View style={styles.container}>
            {/*Vasemmalla hamburger*/}
            <Pressable
                onPress={onPressMenu}
                hitSlop={12}
                style={styles.leftButton}
            >
                {/*Yksinkertainen "hamburger" ilman kirjastoja */}
                <Text style={styles.menuIcon}></Text>
            </Pressable>

            {/*Otsikko*/}
            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>

            {/*Oikea puoli varataan myöhemmin (placeholder)*/}
            <View style={styles.rightSlot}>{right}</View>
        </View>
    )
}




const styles = StyleSheet.create({
    container: {
        height: 56, // yleinen appbar-korkeus
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    leftButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: 'center',
    },
    menuIcon: {
        fontSize: 22,
        lineHeight: 22,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
    },
    rightSlot: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },



})