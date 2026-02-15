import React from "react"
import { Pressable, Text, StyleSheet } from "react-native"

import { useProfileColor } from "../src/theme/useProfileColor"


type AvatarButtonProps = {
    initial: string
    onPress: () => void
}

export function AvatarButton({ initial, onPress }: AvatarButtonProps) {

    const { accentHex, colorName, hasColor } = useProfileColor()

    return (
        <Pressable
            onPress={onPress}
            hitSlop={10}
            style={({ pressed }) => [
                accentHex && { backgroundColor: accentHex },
                styles.circle,
                pressed && styles.pressed,
            ]}
        >
            <Text
                style={styles.letter}>{initial}
            </Text>
        </Pressable>
    )
}

const SIZE = 34


const styles = StyleSheet.create({
    circle: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: StyleSheet.hairlineWidth,

    },
    letter: {
        fontSize: 16,
        fontWeight: "800",


    },
    pressed: {
        opacity: 0.8
    },
})