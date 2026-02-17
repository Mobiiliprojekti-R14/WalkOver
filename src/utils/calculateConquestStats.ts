// src/utils/calculateConquestStats.ts

/**
 * Laskee kartan valloitus-statiikan samalla logiigalla kuin caculateTop3:
 * - Alue on "vallattu", jos maxSteps > 0 alueella
 * - Omistaja (leader) on käyttäjä, jolla maxSteps (tasatilanteessa first match)
 * 
 * Profiilidonuttia varten keskiprosentti = MINUN omistus% koko kartasta:
 * myPct = ownedAreasByMe / totalAreas * 100 (kokonaislukuna)
 */

export type ConquestStats = {
    totalAreas: number
    conqueredAreas: number
    unconqueredAreas: number
    ownedAreasByMe: number
    myPct: number
}

type AnyUserSteps = Record<string, unknown> & {
    username?: string
}

/**
 * @params users - lista käyttäjistä, joilla on alueavaimia (esim. "oulu_123") ja steps-arvoja
 * @params myUserName - kirjautuneen käyttäjän username (sama kenttä kuin users-objekteissa)
 * @params areaPrefix - alueavainten prefix, oletus "oulu"
 */

export function calculateConquestStats(
    users: AnyUserSteps[],
    myUserName?: string,
    areaPrefix: string = 'oulu'
): ConquestStats {
    // 1) perus-guard: jos ei dataa, palautetaan nollat
    if (!users || users.length === 0) {
        return {
            totalAreas: 0,
            conqueredAreas: 0,
            unconqueredAreas: 0,
            ownedAreasByMe: 0,
            myPct: 0
        }
    }

    // 2) Alueavaimet päätellään ensimmäisestä käyttäjäobjektista
    // sama logiikka kuin leaderboardScreenissä
    const areaKeys = Object.keys(users[0]).filter((k) => k.startsWith(areaPrefix))
    const totalAreas = areaKeys.length

    // Jos alueita ei ole ollenkaan, ei lasketa enempää
    if (totalAreas === 0) {
        return {
            totalAreas: 0,
            conqueredAreas: 0,
            unconqueredAreas: 0,
            ownedAreasByMe: 0,
            myPct: 0
        }
    }

    // 3) Lasketaan montako aluetta on vallattu ja montako niistä on "minun"
    let conqueredAreas = 0
    let ownedAreasByMe = 0

    for (const area of areaKeys) {
        // Haetaan kaikkien käyttäjien askeleet tälle alueella.
        // Muutetaan kaikki arvot numeroiksi (undefined/null/"") -> 0
        const steps = users.map((u) => Number(u[area]) || 0)

        // Max steps = alueen johtajan askelmäärä
        const maxSteps = Math.max(...steps)

        // Jos maxSteps on 0 -> kukaan ei ole liikkunut alueella -> valloittamaton
        if (maxSteps === 0) continue

        // Muuten alue on vallattu
        conqueredAreas++

        // etsi "leader" = ensimmäinen käyttäjä jolla on maxSteps
        // (Tasatilanteessa tämä on sama käytös kuin caculateTop3:ssa
        const leader = users.find((u) => (Number(u[area]) || 0) === maxSteps)

        // Jos leader on "minä", kasvatetaan owned-laskuria
        if (leader?.username && myUserName && leader.username === myUserName) {
            ownedAreasByMe++
        }
    }

    const unconqueredAreas = Math.max(totalAreas - conqueredAreas, 0)

    // "Minun" omistus% koko kartasta (kokonaisluku)
    const myPct = Math.round((ownedAreasByMe / totalAreas) * 100)




    return {
        totalAreas,
        conqueredAreas,
        unconqueredAreas,
        ownedAreasByMe,
        myPct
    }
}