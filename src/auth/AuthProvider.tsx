// React Context: tämä pitää sisällään Firebase Auth -käyttäjän ja loading-tilan
// Kun app käynnistyy, Firebase palauttaa async:ina onko käyttäjä kirjautunut
// Ei tarvitse joka screeniin omaa kuuntelijaa -> yksi paikka hoitaa sen

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../../firebase/Config"

// Contextin muoto
type AuthContextValue = {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // user = firebase user tai null jos ei kirjautunut
    const [user, setUser] = useState<User | null>(null)

    // Loading = tosi kunnes Firebase on kertonut auth-tilan ensimmäisen kerran
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // kuuntelija joka aktivoituu:
        // - appin käynnistyksessä
        // - Login
        // - Logout
        const unsubscripe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null)
            setLoading(false)
        })

        // Siivotaan kuuntelija pois unmountissa
        return unsubscripe
    }, [])

    // useMemo: Tämä ei olisi pakollinen mutta hyvä käytäntö jotta provider ei luo uutta objectia turhaan
    const value = useMemo(() => ({ user, loading }), [user, loading])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Helper hook
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth pitää käyttää AuthProviderin sisällä")
    }
    return ctx
}
