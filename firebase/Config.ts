import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firestore helpers
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_APIKEY,
    authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECTID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.EXPO_PUBLIC_APPID,
};

// Init Firebase app once
const app = initializeApp(firebaseConfig);

// Singletons
const firestore = getFirestore(app);
const auth = getAuth(app);

// Collections
const MESSAGES = "message";

export {
    // instances
    firestore,
    auth,

    // constants
    MESSAGES,

    // firestore functions
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    onSnapshot,

    // auth functions
    signInWithEmailAndPassword,
};

