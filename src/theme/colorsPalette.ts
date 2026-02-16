// src/theme/colorsPalette.ts
// Lähde profiiliväreille
// Värit tulevat yhdestä paikasta eivätkä leviä ympäri koodia epäjohdonmukaisesti

// Record:
// tämä on TypeScriptin tyyppigeneraattori
// "Objekti, jossa jokaisella K-avaimella on V-arvo"
// Tämä varmistaa, että kaikki arvot löytyvät ja on oikein kirjoitettu, muuten tulee herjaa

export type ColorFamily = "blue" | "green" | "violet" | "orange" | "pink"
export type ColorVariant = 1 | 2 | 3 | 4

export const COLOR_FAMILY_LABEL: Record<ColorFamily, string> = {
    blue: "MOMENTUM BLUE",
    green: "ENERGY GREEN",
    violet: "POWER VIOLET",
    orange: "DRIVE ORANGE",
    pink: "PULSE PINK",
}

export const COLOR_PALETTE: Record<ColorFamily, Record<ColorVariant, string>> = {
    blue: {
        1: "#3DA9FC",
        2: "#1F7AE0",
        3: "#155BB5",
        4: "#0E3F8A",
    },
    green: {
        1: "#34C759",
        2: "#28A745",
        3: "#1E7F3A",
        4: "#155C2B",
    },
    violet: {
        1: "#9B5DE5",
        2: "#7A3FE0",
        3: "#5C2DB8",
        4: "#3E1F87",
    },
    orange: {
        1: "#FF9F1C",
        2: "#F77F00",
        3: "#D96500",
        4: "#A44A00",
    },
    pink: {
        1: "#FF4D9D",
        2: "#E03183",
        3: "#B81F6A",
        4: "#87174E",
    },
}

// HELPER FUNKTIOT

// Palauttaa perheen UI-nimen
// esim: profiilissa "PULSE PINK"
export function getColorName(family: ColorFamily): string {
    return COLOR_FAMILY_LABEL[family]
}

// Palauttaa accentHex tai null
// komponentti voi tehdä "jos null -> Paper default"
export function getAccentHexFromProfile(
    family: ColorFamily | null | undefined,
    variant: ColorVariant | null | undefined
): string | null {
    if (!family || !variant) return null
    return COLOR_PALETTE[family][variant]
}

// Palauttaa accentHex suoraan family+variantista
// Käytetään erityisesti generoinnin jälkeen, kun halutaan tallentaa myös userColor Firestoreen
export function getAccentHex(family: ColorFamily, variant: ColorVariant): string {
    return COLOR_PALETTE[family][variant]
}


// VÄRIGENERAATTORI

// Sallitut arvot listana
// Näistä arvotaan satunnaisesti, eikä muualta

// as const -> tämä lukitsee arvot kirjaimellisesti, eli TS pystyy varmistamaan, että listassa ei ole mitään ylimääräistä
export const COLOR_FAMILIES = ["blue", "green", "violet", "orange", "pink"] as const
export const COLOR_VARIANTS = [1, 2, 3, 4] as const

// Arvotaan satunnainen alkio listasta
// Sama logiikka perheille ja varianteille, tyypit säilyy oikein
// readonly T[] -> toimii suoraan as const -listojen kanssa (geneerinen)
// palautustyyppi on tarkka (ei leviä stringiksi)
function pickRandom<T>(items: readonly T[]): T {
    const index = Math.floor(Math.random() * items.length)
    return items[index]
}

// Generoi uusi väriprofiili (family + variant)
export function generateProfileColor(
    currentFamily?: ColorFamily | null,
    currentVariant?: ColorVariant | null
): { family: ColorFamily; variant: ColorVariant } {

    while (true) {
        const family = pickRandom(COLOR_FAMILIES)
        const variant = pickRandom(COLOR_VARIANTS)

        // Jos ei ole nykyistä väriä (ensimmäinen generointi), hyväksy heti
        if (!currentFamily || !currentVariant) {
            return { family, variant }
        }

        // Regenerate: ei saa palauttaa samaa kombinaatiota
        const isSame = family === currentFamily && variant === currentVariant
        if (!isSame) {
            return { family, variant }
        }

        // muuten loop jatkuu ja arvotaan uusi
    }
}