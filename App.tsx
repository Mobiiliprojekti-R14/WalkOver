import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react"
import { StyleSheet, Text, View, Button } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, MESSAGES } from "./firebase/Config";

import MapViewWithLocation from './components/MapViewWithLocation';



export default function App() {

  {/* 
  useEffect(() => {
    // Realtime kuuntelu (lukutesti)

    const q = query(collection(firestore, MESSAGES), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        console.log(
          "🔥 Firestore snapshot ok. Docs:",
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      },
      (err) => {
        console.log("❌ Firestore onSnapshot error:", err);
      }
    );

    return () => unsub();
  }, []);

  const testWrite = async () => {
    try {
      const ref = await addDoc(collection(firestore, MESSAGES), {
        text: "Ping from Expo",
        createdAt: serverTimestamp(),
      });

      console.log("✅ Firestore write ok. Doc id:", ref.id);
    } catch (err) {
      console.log("❌ Firestore write error:", err);
    }
  };
  */}
  return (
    <MapViewWithLocation></MapViewWithLocation>

    /*
    < View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }
    }>
      <Text style={{ fontSize: 18 }}>Firestore connection test</Text>
      <Button title="Test write (addDoc)" onPress={testWrite} />
      <Text style={{ opacity: 0.7, marginTop: 8 }}>Katso logit konsolista</Text>
    </View >
    */


  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
