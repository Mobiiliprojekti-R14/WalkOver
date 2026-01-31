// src/services/SignUpService.ts
// Rekisteröinnin “use case” / service.

import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth"
import { doc, runTransaction, serverTimestamp } from "firebase/firestore"
import { auth, db, COLLECTIONS } from "../../firebase/Config"

/**
 * Input jonka UI antaa suoraan (kenttien state-arvot).
 * HUOM: confirmPassword on vain UI-validointia varten, sitä ei lähetetä Firebaseen.
 */
export type SignUpInput = {
    username: string
    email: string
    password: string
    confirmPassword: string
}

/**
 * Onnistumisen data.
 * Hyödyllistä palauttaa uid ja normalisoidut arvot (debug/UI).
 */
export type SignUpSuccess = {
    uid: string
    username: string // normalisoitu: trim + lowercase
    displayName: string // Käyttäjän syöttämä "näyttönimi" (trim)
    email: string // trim
}

/**
 * Standardoidut virhekoodit UI:lle.
 * UI ei saa olla riippuvainen Firebase error -koodeista (ne voivat muuttua / olla sekavia).
 */
export type SignUpErrorCode =
    | "MISSING_FIELDS"
    | "INVALID_USERNAME"
    | "USERNAME_TAKEN"
    | "INVALID_EMAIL"
    | "EMAIL_IN_USE"
    | "WEAK_PASSWORD"
    | "PASSWORD_MISMATCH"
    | "NETWORK_ERROR"
    | "UNKNOWN"

/**
 * Palvelun heittämä virhe (throw-malli).
 * Screen voi catchata tämän ja näyttää message/tehdä eri UI-toimia code:n perusteella.
 */
export class SignUpServiceError extends Error {
    code: SignUpErrorCode
    cause?: unknown

    constructor(code: SignUpErrorCode, message: string, cause?: unknown) {
        super(message)
        this.name = "SignUpServiceError"
        this.code = code
        this.cause = cause
    }
}

/* ---------------------------
   Apufunktiot (sisäiset)
---------------------------- */

/**
 * Normalisoi käyttäjänimi -> trim + lowercase.
 * Uniikkius on helpompi ja tasapuolisempi (Ville == ville).
 */
function normalizeUsername(username: string) {
    return username.trim().toLowerCase()
}

/**
 * Tarkistaa username-säännöt MVP:lle.
 
 * Säännöt:
 * - 3–20 merkkiä
 * - sallitut: a-z, 0-9, piste (.) ja alaviiva (_)
 */
function isValidUsername(usernameLower: string) {
    if (usernameLower.length < 3 || usernameLower.length > 20) return false
    return /^[a-z0-9._]+$/.test(usernameLower)
}

/**
 * Muuttaa Firebase errorit meidän omiksi standardivirheiksi.
 * UI näyttää aina selkeitä viestejä, eikä tarvitse tuntea Firebase-koodeja.
 */
function mapFirebaseSignUpError(err: any): SignUpServiceError {
    const code = err?.code

    if (code === "auth/email-already-in-use") {
        return new SignUpServiceError("EMAIL_IN_USE", "Tuo sähköposti on jo rekisteröity.", err)
    }
    if (code === "auth/invalid-email") {
        return new SignUpServiceError("INVALID_EMAIL", "Virheellinen sähköpostiosoite.", err)
    }
    if (code === "auth/weak-password") {
        return new SignUpServiceError("WEAK_PASSWORD", "Salasana on liian heikko (vähintään 6 merkkiä).", err)
    }

    // Network / timeout -tyyppiset virheet vaihtelevat, mutta tämä kattaa yleisimmät
    if (code === "auth/network-request-failed") {
        return new SignUpServiceError("NETWORK_ERROR", "Verkkovirhe. Tarkista yhteys ja yritä uudelleen.", err)
    }

    return new SignUpServiceError("UNKNOWN", "Rekisteröinti epäonnistui. Yritä uudelleen.", err)
}

/* ---------------------------
   Julkinen funktio
---------------------------- */

/**
 * Luo käyttäjä (Auth) + varaa uniikki käyttäjänimi (Firestore transaction) + luo users-profiili.
 * Tämä on koko rekisteröinnin “yksi totuus”, jota UI kutsuu.
 *
 * THROW:
 * - Heittää SignUpServiceError virheen, jonka UI voi näyttää käyttäjälle.
 */
export async function signUp(input: SignUpInput): Promise<SignUpSuccess> {
    // 1) Siistitään arvot (UI voi antaa extra-välilyöntejä)
    const displayName = input.username.trim()   // Voidaan näyttää UI:ssa
    const usernameLower = normalizeUsername(input.username) // Käytetään tunnisteena
    const emailClean = input.email.trim()
    const { password, confirmPassword } = input

    // 2) Nopeat validoinnit ennen verkko-operaatioita (parempi UX + vähemmän turhaa liikennettä)
    if (!usernameLower || !emailClean || !password || !confirmPassword) {
        throw new SignUpServiceError("MISSING_FIELDS", "Täytä kaikki kentät.")
    }

    if (!isValidUsername(usernameLower)) {
        throw new SignUpServiceError("INVALID_USERNAME", "Käyttäjänimi: 3–20 merkkiä (a-z, 0-9, . tai _).")
    }

    if (password !== confirmPassword) {
        throw new SignUpServiceError("PASSWORD_MISMATCH", "Salasanat eivät täsmää.")
    }

    // (Firebase vaatii käytännössä vähintään 6 merkkiä, mutta voidaan tarkistaa jo tässä)
    if (password.length < 6) {
        throw new SignUpServiceError("WEAK_PASSWORD", "Salasana on liian lyhyt (vähintään 6 merkkiä).")
    }

    // 3) Luodaan Auth-käyttäjä
    // HUOM: Tässä kohtaa Firebase hoitaa salasanan turvallisen käsittelyn palvelimella.
    let createdUser: any = null

    try {
        const cred = await createUserWithEmailAndPassword(auth, emailClean, password)
        createdUser = cred.user
        const uid = createdUser.uid

        // 4) Varaa username + luo users-profiili transaktiolla
        // MIKSI: estää race conditionin (kaksi käyttäjää ei voi varata samaa nimeä yhtä aikaa).
        await runTransaction(db, async (tx) => {
            const usernameRef = doc(db, COLLECTIONS.USERNAMES, usernameLower)
            const userRef = doc(db, COLLECTIONS.USERS, uid)

            const usernameSnap = await tx.get(usernameRef)
            if (usernameSnap.exists()) {
                // Oma virhe, jota käsitellään catchissa
                throw new SignUpServiceError("USERNAME_TAKEN", "Käyttäjänimi on varattu. Kokeile toista.")
            }

            tx.set(usernameRef, {
                uid,
                createdAt: serverTimestamp(),
            })

            tx.set(userRef, {
                username: usernameLower,
                displayName: displayName,
                email: emailClean,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

        })

        // 5) Onnistuminen
        return { uid, username: usernameLower, displayName, email: emailClean }
    } catch (err: any) {
        // 6) Jos transaktio epäonnistui username-takian, Auth-käyttäjä voi jäädä “orvoksi”.
        // Fiksu siivous: poistetaan juuri luotu Auth user, jos me luotiin se tässä kutsussa.
        //
        // HUOM: deleteUser voi myös epäonnistua (esim. jos sessio invalid), mutta yritetään parhaamme.
        if (createdUser && err instanceof SignUpServiceError && err.code === "USERNAME_TAKEN") {
            try {
                await deleteUser(createdUser)
            } catch (cleanupErr) {
                // Ei kaadeta tähän — logitetaan vain deville
                console.log("Cleanup deleteUser failed:", cleanupErr)
            }
            throw err // heitetään edelleen alkuperäinen selkeä virhe UI:lle
        }

        // Jos heitettiin jo meidän oma SignUpServiceError (esim. USERNAME_TAKEN), heitetään sellaisenaan
        if (err instanceof SignUpServiceError) {
            throw err
        }

        // Muussa tapauksessa mapitetaan Firebase error -> meidän standardivirhe
        throw mapFirebaseSignUpError(err)
    }
}