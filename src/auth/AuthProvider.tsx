// React Context: tämä pitää sisällään Firebase Auth -käyttäjän ja loading-tilan
// Kun app käynnistyy, Firebase palauttaa async:ina onko käyttäjä kirjautunut
// Ei tarvitse joka screeniin omaa kuuntelijaa -> yksi paikka hoitaa sen

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { db, auth, COLLECTIONS } from "../../firebase/Config"

import { doc, getDoc } from "firebase/firestore"
//import firebase from "firebase/compat/app"


// Profiilin tiedot, joita UI tarvitsee
export type UserProfile = {
    displayName: string | null
    username: string | null
    email: string | null
}
// Contextin muoto
type AuthContextValue = {
    user: User | null
    loading: boolean
    profile: UserProfile | null
    profileLoading: boolean
}



const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // user = firebase user tai null jos ei kirjautunut
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [profileLoading, setProfileLoading] = useState(false)

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
                    const data = snap.data() as { displayName?: string, username?: string }
                    setProfile({
                        displayName: data.displayName ?? null,
                        username: data.username ?? null,
                        email,
                    })
                } else {
                    // Profiilia ei vielä ole -> pidetään email mukana
                    setProfile({ displayName: null, username: null, email })
                }
            } catch (e) {
                console.warn("Profiilin lataus epäonnistui", e)
                if (!cancelled) {
                    setProfile({
                        displayName: null,
                        username: null,
                        email: user.email ?? null
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
        () => ({ user, loading, profile, profileLoading }),
        [user, loading, profile, profileLoading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth pitää käyttää AuthProviderin sisällä")
    return ctx
}
