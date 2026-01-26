import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Card, Button } from 'react-native-paper';
import { login, logout } from '../src/services/SignInService';

type Props = {
  onSwitchToSignUp: () => void
}

export function LoginScreen({ onSwitchToSignUp }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [securePassword, setSecurePassword] = useState(true)


  const handleLogin = async () => {
    console.log('Yritetään kirjautua:', username)

    const user = await login(username, password)
    if (user) {
      console.log('Kirjautuminen onnistui', user.uid)
      alert('Kirjautuminen onnistui')
    } else {
      console.log('Kirjautuminen epäonnistui')
      alert('Kirjautuminen epäonnistui')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Tervetuloa pelaamaan WalkOn!</Text>
      <Text style={styles.tipText}>Kirjaudu tai aloita luomalla käyttäjä.</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text>Käyttäjänimi</Text>
          <TextInput
            mode="outlined"
            placeholder='käyttäjänimi'
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          <Text>Password</Text>
          <TextInput
            mode="outlined"
            secureTextEntry={securePassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            right={<TextInput.Icon icon=
              {securePassword ? "eye" : "eye-off"} onPress={() =>
                setSecurePassword(!securePassword)} />}
          />

          <View style={styles.buttonRow}>
            {/*<Button
              mode="text"
              onPress={() => console.log('Siirrytään rekisteröitymään')}
              style={styles.signInButton}
            > Luo käyttäjä </Button>*/}
            <Button
              mode="text"
              onPress={handleLogin}
              style={styles.logInButton}
            > Kirjaudu </Button>
          </View>
          <Text
            variant="bodyMedium"
            style={[styles.switchText && styles.disabledText]}
            onPress={onSwitchToSignUp}
          >
            <Text style={styles.switchTextBold}>Luo tili</Text>
          </Text>
        </Card.Content>
      </Card>
    </View>


  )
}

const styles = StyleSheet.create({
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
    width: '90%',
    elevation: 4,
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  buttonRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  logInButton: {

  },
  switchText: {
  
  },
  disabledText: {

  },
  switchTextBold: {

  },


})