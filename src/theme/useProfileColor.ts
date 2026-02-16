// src/theme/useProfileColor.ts

// Profiilivärin käyttöön joka screenissä
// Vältetään toisto (getAccentHexProfile + getColorName) kaikkialla

import { useAuth } from "../auth/AuthProvider";
import { getAccentHexFromProfile, getColorName } from "./colorsPalette";

export function useProfileColor() {
    const { profile } = useAuth()

    //1) Ensisijainen: Tiimin yhteinen userColor
    const primaryHex = profile?.userColor ?? null

    // 2) Fallback: johdetaan hex perheestä+variantista (palettilogiikka)
    const fallBackHex = getAccentHexFromProfile(profile?.colorFamily, profile?.colorVariant)

    // 3) Lopullinen accent
    const accentHex = primaryHex ?? fallBackHex

    // 4) Onko käyttäjällä väri?
    // true jos userColor on asetettu TAI family+variant on asetettu
    const hasColor = Boolean(primaryHex || (profile?.colorFamily && profile?.colorVariant))

    // 5) Näyttönimi (vain jos perhe tiedossa)
    const colorName = profile?.colorFamily ? getColorName(profile.colorFamily) : null

    return {
        accentHex, // string | null
        colorName, // string | null
        hasColor, // boolean
    }
}