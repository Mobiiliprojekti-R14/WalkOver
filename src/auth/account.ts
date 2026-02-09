// src/auth/account.ts

// Käyttäjätiliin liittyvät Firebase Auth -toiminnot

import {
    getAuth,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser,
} from "firebase/auth"


export async function deleteAccountWithPassword(currentPassword: string) {
    const auth = getAuth()
    const user = auth.currentUser

    // 1) Varmistetaan, että käyttäjä on kirjautuneena ja email löytyy
    // EmailAuthProvider tarvitsee emailin credentialiin
    if (!user || !user.email) {
        throw { code: "auth/no-current-user" }
    }

    // 2) re-auth (pakollinen turvallisuussyistä)
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)

    // 3) poistetaan käyttäjä Authista
    await deleteUser(user)
}