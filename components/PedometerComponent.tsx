import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Pedometer';
import { updateDoc, doc, increment } from "firebase/firestore"
import { db } from "../firebase/Config"
import { useAuth } from "../src/auth/AuthProvider"



export default function PedometerComponent({ cellNumber }: { cellNumber: number }) {

  const { user } = useAuth()


  const [isPedometerAvailable, setIsPedometerAvailable] = useState<string>('checking')
  const [currentSteps, setCurrentSteps] = useState<number>(0)

  useEffect(() => {
    // Tallennetaan pedometerin kuunteluobjekti
    let subscription: Subscription | null = null

    const start = async () => {
      // Pyydetään lupa askelmittarin käyttöön
      const { status } = await Pedometer.requestPermissionsAsync()
      if (status !== 'granted') {
        setIsPedometerAvailable('permission denied')
        return
      }

      // Tarkistetaan, onko laitteessa askelmittari
      const available = await Pedometer.isAvailableAsync()
      setIsPedometerAvailable(String(available))

      if (!available) return

      // Aloitetaan askelien seuranta

      let lastSavedSteps = 0
      let isSaving = false

      subscription = Pedometer.watchStepCount(async result => {
        if (!user) return
        setCurrentSteps(result.steps)
        if (isSaving) return

        if (result.steps - lastSavedSteps >= 20) {
          isSaving = true
          console.log("lisätään tietokantaan askelmäärä: ", result.steps-lastSavedSteps)
          if (cellNumber >= 1 && cellNumber <= 16) {
            const field = `oulu${cellNumber}`

            try {
              await updateDoc(doc(db, "users", user.uid), {
                [field]: increment(result.steps-lastSavedSteps)
              })
            } finally {
              isSaving = false
            }
          }

          lastSavedSteps = result.steps
        }
      })
    }

    start()

    // Poistetaan kuunteluobjekti
    return () => {
      subscription?.remove()
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text>Askeleet: {currentSteps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: "black",
    fontSize: 16,
  }
});
