import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapViewWithLocation from './components/MapViewWithLocation';

export default function App() {
  return (
    <MapViewWithLocation></MapViewWithLocation>
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
