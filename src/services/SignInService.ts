
import { auth, db } from '../../firebase/Config'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'


//Kirjautuminen nimimerkillä
export const login = async (username: string, password: string) => {

    try {
        //Etsitään Firestoresta dokumentti, jossa username täsmää
        console.log("Haetaan Firestoresta")
        const usersRef = collection(db, "users") //Tarkistellaan users kansiota
        const q = query(usersRef, where("username", "==", username.trim())) //Etsitään vastaava käyttäjänimi

        console.log("Odotetaan vastausta")
        const searchResult = await getDocs(q)

        if (searchResult.empty) {
            console.log("Käyttäjätunnusta ei löytynyt Firestoresta")
            return null
        }

        //Poimitaan sähköposti
        const userData = searchResult.docs[0].data()
        const linkedEmail = userData.email //Tallentaa muistiin
        console.log("Löytyi sähköposti:", linkedEmail)

        //Kirjaudutaan sisään löydetyllä sähköpostilla
        const userResponse = await signInWithEmailAndPassword(auth, linkedEmail, password)
        return userResponse.user

    } catch (error: any) {
        console.log("Virhekoodi:", error.code)
        return null
    }
}

//Uloskirjautuminen
export const logout = async () => {
    try {
        await signOut (auth)
        console.log("Uloskirjautuminen onnistui")
        return true
    } catch (error) {
        console.log("Uloskirjautuminen epäonnistui")
        return false
    }
}
