// Firebase app init + auth + firestore

import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


// Luetaan Firebase config .env-muuttujasta
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_APIKEY,
    authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECTID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.EXPO_PUBLIC_APPID,
};

// Varmistus: jos env puuttuu
if (!firebaseConfig.apiKey) {
    throw new Error("Firebase .env puuttuu: tarkista EXPO_PUBLIC_APIKEY ym")
}

// Init firebase-app vain kerran
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)


// Singletons (koko appi käyttää näitä)
export const auth = getAuth(app)
export const db = getFirestore(app)
//const firestore = getFirestore(app);
//const auth = getAuth(app);

// Collections (kokoelmien nimet yhteen paikkaan)
export const COLLECTIONS = {
    USERS: "users",
    USERNAMES: "usernames",
    // Tähän voi lisätä Cells, Steps, ym ym
} as const

export { signInWithEmailAndPassword, signOut }