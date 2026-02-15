// React Context: tämä pitää sisällään Firebase Auth -käyttäjän ja loading-tilan
// Kun app käynnistyy, Firebase palauttaa async:ina onko käyttäjä kirjautunut
// Ei tarvitse joka screeniin omaa kuuntelijaa -> yksi paikka hoitaa sen

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { db, auth, COLLECTIONS } from "../../firebase/Config"

import { doc, getDoc, onSnapshot } from "firebase/firestore"
//import firebase from "firebase/compat/app"

export type ColorFamily =
    | "blue"
    | "green"
    | "violet"
    | "orange"
    | "pink"

// Profiilin tiedot, joita UI tarvitsee
export type UserProfile = {
    displayName: string | null
    username: string | null
    email: string | null
    cells: number[] | null
    userColor: string | null

    colorFamily: ColorFamily | null
    colorVariant: 1 | 2 | 3 | 4 | null
}
// Contextin muoto
type AuthContextValue = {
    user: User | null
    loading: boolean
    profile: UserProfile | null
    profileLoading: boolean
    stepsInCell: number[]
    setStepsInCell: React.Dispatch<React.SetStateAction<number[]>>
}



const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // user = firebase user tai null jos ei kirjautunut
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const [stepsInCell, setStepsInCell] = useState<number[]>(Array(16).fill(0))

    // Loading = tosi kunnes Firebase on kertonut auth-tilan ensimmäisen kerran
    const [loading, setLoading] = useState(true)

    //1) Firebase auth state kuuntelija
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    //2) Ladataan Firestore-profiili aina kun user muuttuu
    // useEffect(() => {
    //     let cancelled = false

    //     async function loadProfile() {
    //         if (!user) {
    //             setProfile(null)
    //             setProfileLoading(false)
    //             return
    //         }

    //         setProfileLoading(true)

    //         try {
    //             const email = user.email ?? null
    //             const ref = doc(db, COLLECTIONS.USERS, user.uid)
    //             const snap = await getDoc(ref)

    //             if (cancelled) return

    //             if (snap.exists()) {
    //                 const data = snap.data() as { 
    //                     displayName?: string,
    //                     username?: string,
    //                     oulu1?: number,
    //                     oulu2?: number,
    //                     oulu3?: number,
    //                     oulu4?: number,
    //                     oulu5?: number,
    //                     oulu6?: number,
    //                     oulu7?: number,
    //                     oulu8?: number,
    //                     oulu9?: number,
    //                     oulu10?: number,
    //                     oulu11?: number,
    //                     oulu12?: number,
    //                     oulu13?: number,
    //                     oulu14?: number,
    //                     oulu15?: number,
    //                     oulu16?: number
    //                 }
    //                 setProfile({
    //                     displayName: data.displayName ?? null,
    //                     username: data.username ?? null,
    //                     email,
    //                     cells: [
    //                         data.oulu1 ?? 0,
    //                         data.oulu2 ?? 0,
    //                         data.oulu3 ?? 0,
    //                         data.oulu4 ?? 0,
    //                         data.oulu5 ?? 0,
    //                         data.oulu6 ?? 0,
    //                         data.oulu7 ?? 0,
    //                         data.oulu8 ?? 0,
    //                         data.oulu9 ?? 0,
    //                         data.oulu10 ?? 0,
    //                         data.oulu11 ?? 0,
    //                         data.oulu12 ?? 0,
    //                         data.oulu13 ?? 0,
    //                         data.oulu14 ?? 0,
    //                         data.oulu15 ?? 0,
    //                         data.oulu16 ?? 0
    //                     ]
    //                 })
    //             } else {
    //                 // Profiilia ei vielä ole -> pidetään email mukana
    //                 setProfile({ displayName: null, username: null, email, cells: Array(16).fill(0) })
    //             }
    //         } catch (e) {
    //             console.warn("Profiilin lataus epäonnistui", e)
    //             if (!cancelled) {
    //                 setProfile({
    //                     displayName: null,
    //                     username: null,
    //                     email: user.email ?? null,
    //                     cells: Array(16).fill(0)
    //                 })
    //             }
    //         } finally {
    //             if (!cancelled) setProfileLoading(false)
    //         }
    //     }

    //     loadProfile()
    //     return () => {
    //         cancelled = true
    //     }
    // }, [user])

    useEffect(() => {
        let cancelled = false

        async function loadProfile() {
            if (!user) {
                setProfile(null)
                setProfileLoading(false)
                return
            }

            setProfileLoading(true)

            try {
                const email = user.email ?? null
                const ref = doc(db, COLLECTIONS.USERS, user.uid)
                const snap = await getDoc(ref)

                if (cancelled) return

                if (snap.exists()) {
                    const data = snap.data() as {
                        displayName?: string,
                        username?: string,
                        colorFamily?: ColorFamily
                        colorVariant?: 1 | 2 | 3 | 4
                        userColor?: string,
                        oulu1?: number,
                        oulu2?: number,
                        oulu3?: number,
                        oulu4?: number,
                        oulu5?: number,
                        oulu6?: number,
                        oulu7?: number,
                        oulu8?: number,
                        oulu9?: number,
                        oulu10?: number,
                        oulu11?: number,
                        oulu12?: number,
                        oulu13?: number,
                        oulu14?: number,
                        oulu15?: number,
                        oulu16?: number
                    }

                    // MITÄ: varmistetaan että family ja variant ovat aina parina
                    // MIKSI: vältetään rikkitila (vain toinen asetettu)

                    const rawFamily = data.colorFamily ?? null
                    const rawVariant = data.colorVariant ?? null

                    let colorFamily: ColorFamily | null = null
                    let colorVariant: 1 | 2 | 3 | 4 | null = null

                    // Jos molemmat olemassa → hyväksytään
                    if (rawFamily !== null && rawVariant !== null) {
                        colorFamily = rawFamily
                        colorVariant = rawVariant
                    }
                    // Muussa tapauksessa → NoColor-tila
                    // (molemmat null)

                    setProfile({
                        displayName: data.displayName ?? null,
                        username: data.username ?? null,
                        email,
                        userColor: data.userColor ?? null,

                        colorFamily,
                        colorVariant,

                        cells: [
                            data.oulu1 ?? 0,
                            data.oulu2 ?? 0,
                            data.oulu3 ?? 0,
                            data.oulu4 ?? 0,
                            data.oulu5 ?? 0,
                            data.oulu6 ?? 0,
                            data.oulu7 ?? 0,
                            data.oulu8 ?? 0,
                            data.oulu9 ?? 0,
                            data.oulu10 ?? 0,
                            data.oulu11 ?? 0,
                            data.oulu12 ?? 0,
                            data.oulu13 ?? 0,
                            data.oulu14 ?? 0,
                            data.oulu15 ?? 0,
                            data.oulu16 ?? 0
                        ]
                    })
                } else {
                    // Profiilia ei vielä ole -> pidetään email mukana
                    setProfile({
                        displayName: null,
                        username: null,
                        email,
                        userColor: null,
                        colorFamily: null,
                        colorVariant: null,
                        cells: Array(16).fill(0)
                    })
                }
            } catch (e) {
                console.warn("Profiilin lataus epäonnistui", e)
                if (!cancelled) {
                    setProfile({
                        displayName: null,
                        username: null,
                        email: user.email ?? null,
                        userColor: null,
                        colorFamily: null,
                        colorVariant: null,
                        cells: Array(16).fill(0)
                    })
                }
            } finally {
                if (!cancelled) setProfileLoading(false)
            }
        }

        loadProfile()
        return () => {
            cancelled = true
        }
    }, [user])

    const value = useMemo(
        () => ({ user, loading, profile, profileLoading, stepsInCell, setStepsInCell }),
        [user, loading, profile, profileLoading, stepsInCell]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth pitää käyttää AuthProviderin sisällä")
    return ctx
}