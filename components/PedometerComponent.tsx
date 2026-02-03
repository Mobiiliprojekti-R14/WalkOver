import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Pedometer';

export default function PedometerComponent() {

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

      subscription = Pedometer.watchStepCount(result => {
        setCurrentSteps(result.steps)

        if(result.steps - lastSavedSteps >=50) {
          //TÄHÄN VÄLIIN TEHDÄÄN TALLENNUS TIETOKANTAAN
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
      {/*<Text>Pedometer available: {isPedometerAvailable}</Text>*/}
      <Text>Steps counted now: {currentSteps}</Text>
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
