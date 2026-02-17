import { useState } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { Text, TextInput, Card, Button } from 'react-native-paper';
import { login, logout } from '../src/services/SignInService';
import { SafeAreaView } from "react-native-safe-area-context";
import { LoggingInScreen } from './LoggingInScreen';

type Props = {
  onSwitchToSignUp: () => void
}

export function LoginScreen({ onSwitchToSignUp }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [securePassword, setSecurePassword] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false) //Kun tila true, korvataan kirjautumisikkuna latausruudulla

  const handleLogin = async () => {
    setIsLoggingIn(true) //Avaa latausruudun
    console.log('Yritetään kirjautua:', username)
    const user = await login(username, password)

    if (user) {
      console.log('Kirjautuminen onnistui', user.uid)
      //alert('Kirjautuminen onnistui')

    } else {
      console.log('Kirjautuminen epäonnistui')
      alert('Kirjautuminen epäonnistui')
      setIsLoggingIn(false) //Palauttaa käyttäjän kirjautumisikkunaan, kirjautuminen ei onnistunut
    }
  }

  if (isLoggingIn) {
    return <LoggingInScreen />
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Määrittää mitä tapahtuu kosketuksille, kun näppäimistö auki
          keyboardDismissMode="on-drag"       // Näppäimistö sulkeutuu heti kun käyttäjä alkaa scrollata
          showsVerticalScrollIndicator={false}  // Piilottaa oikean reunan scroll-palkin
        >
          <Text style={styles.welcomeText}>Tervetuloa pelaamaan WalkOver!</Text>
          <Text style={styles.tipText}>Kirjaudu tai aloita luomalla käyttäjä.</Text>
          <Card style={styles.card}>
            <Card.Content>

              <TextInput
                mode="outlined"
                label='Käyttäjänimi'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label='Salasana'
                secureTextEntry={securePassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                right={<TextInput.Icon icon=
                  {securePassword ? "eye" : "eye-off"} onPress={() =>
                    setSecurePassword(!securePassword)} />}
              />

              <View style={styles.buttonRow}>


                <Button
                  mode="outlined"
                  onPress={onSwitchToSignUp}
                  style={styles.sideButton}
                >
                  Luo tili
                </Button>

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={styles.logInButton}
                > Kirjaudu
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F5F7"
  },
  keyboardAvoid: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  tipText: {
    fontSize: 18,
    marginBottom: 50,
    textAlign: 'center'
  },
  card: {
    elevation: 4,
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  buttonRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: "space-between",
    gap: 12,

  },
  sideButton: {
    flex: 1,
  },
  logInButton: {

    flex: 1,
  },
  switchText: {
    textAlign: "center",
  },
  disabledText: {

  },
  switchTextBold: {

  },


})