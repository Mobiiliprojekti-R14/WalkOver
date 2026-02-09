// src/auth/password.ts

// KAIKKI salasanan vaihtoon liittyvä Firebase-logiikka
// Erotetaan UI ja auth-logiikka

import {
    getAuth,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    sendPasswordResetEmail,
} from "firebase/auth"


// -------------------
// In-App salasanan vaihto
// -------------------

export async function changePasswordInApp(
    currentPassword: string,
    newPassword: string
) {
    const auth = getAuth()
    const user = auth.currentUser

    // 1) Varmistetaan, että käyttäjä on kirjautunut
    if (!user || !user.email) {
        throw { code: "auth/no-current-user" }
    }

    // 2) Luodaan credentials nykyisellä salasanalla
    // Firebase vaatii "recent login" varmistuksen
    const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
    )

    // 3) re-auth
    // Kun käyttäjä on kirjautunut sovellukseen ja haluaa vaihtaa salasanan ilman sähköpostia
    // Firebasen näkökulmasta tämä tarkoittaa kahta asiaa.
    // 1. Uudelleen todennus (reauthentication)
    // 2. Salasanan päivitys
    // - Firebase suojaa näitä toimintoja ja vaatii reauthin, eli pakottaa kaksivaiheisuuden turvallisuussyistä
    await reauthenticateWithCredential(user, credential)

    // 4) Varsinainen salasanan vaihto
    await updatePassword(user, newPassword)
}

// --------------------
// Reset-linkki sähköpostiin
// --------------------

export async function sendPasswordResetLink(email: string) {
    const auth = getAuth()

    if (!email) {
        throw { code: "auth/invalid-email" }
    }

    // Firebase luo reset-tokenin ja lähettää sähköpostiin
    // Turvallinen, testattu ja Spark-yhteensopiva

    await sendPasswordResetEmail(auth, email)
}