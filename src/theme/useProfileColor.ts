// src/theme/useProfileColor.ts

// Profiilivärin käyttöön joka screenissä
// Vältetään toisto (getAccentHexProfile + getColorName) kaikkialla

import { useAuth } from "../auth/AuthProvider";
import { getAccentHexFromProfile, getColorName } from "./colorsPalette";

export function useProfileColor() {
    const { profile } = useAuth()

    const accentHex = getAccentHexFromProfile(profile?.colorFamily, profile?.colorVariant)
    const hasColor = Boolean(profile?.colorFamily && profile?.colorVariant)

    const colorName = profile?.colorFamily ? getColorName(profile.colorFamily) : null

    return {
        accentHex, // string | null
        colorName, // string | null
        hasColor, // boolean
    }
}