import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Polygon, Region } from 'react-native-maps'
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'




export default function MapViewWithLocation() {


  const [location, setLocation] = useState<any>()
  console.log(location)

  const getCurrentLocation = async (): Promise<void> => {
    try {
      const { status } = await requestForegroundPermissionsAsync()

      const currentLocation = await getCurrentPositionAsync({
        accuracy: Accuracy.High
      })
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  
  const coords = [{ latitude: 65.01, longitude: 25.5 }, { latitude: 65.03, longitude: 25.7 }, { latitude: 65.04, longitude: 25.3 }]
  const coords2 = [{ latitude: 65.089615, longitude: 25.377071 }, { latitude: 65.08917, longitude: 25.71861 }, { latitude: 64.94528, longitude: 25.71861 }, { latitude: 64.94583, longitude: 25.37694 }] // Koko pelialue


  const cell1 = [
    { latitude: 65.089615, longitude: 25.377071 },
    { latitude: 65.089615, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.377071 }
  ]

  const cell2 = [
    { latitude: 65.089615, longitude: 25.46245575 },
    { latitude: 65.089615, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.46245575 }
  ]

  const cell3 = [
    { latitude: 65.089615, longitude: 25.5478405 },
    { latitude: 65.089615, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.5478405 }
  ]

  const cell4 = [
    { latitude: 65.089615, longitude: 25.63322525 },
    { latitude: 65.089615, longitude: 25.71861 },
    { latitude: 65.05366875, longitude: 25.71861 },
    { latitude: 65.05366875, longitude: 25.63322525 }
  ]

  const cell5 = [
    { latitude: 65.05366875, longitude: 25.377071 },
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.377071 }
  ]

  const cell6 = [
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.46245575 }
  ]

  const cell7 = [
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.5478405 }
  ]

  const cell8 = [
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.71861 },
    { latitude: 65.0177225, longitude: 25.71861 },
    { latitude: 65.0177225, longitude: 25.63322525 }
  ]

  const cell9 = [
    { latitude: 65.0177225, longitude: 25.377071 },
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.377071 }
  ]

  const cell10 = [
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.46245575 }
  ]

  const cell11 = [
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.5478405 }
  ]

  const cell12 = [
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.71861 },
    { latitude: 64.98177625, longitude: 25.71861 },
    { latitude: 64.98177625, longitude: 25.63322525 }
  ]

  const cell13 = [
    { latitude: 64.98177625, longitude: 25.377071 },
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.94583, longitude: 25.46245575 },
    { latitude: 64.94583, longitude: 25.377071 }
  ]

  const cell14 = [
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.94583, longitude: 25.5478405 },
    { latitude: 64.94583, longitude: 25.46245575 }
  ]

  const cell15 = [
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.94583, longitude: 25.63322525 },
    { latitude: 64.94583, longitude: 25.5478405 }
  ]

  const cell16 = [
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.71861 },
    { latitude: 64.94583, longitude: 25.71861 },
    { latitude: 64.94583, longitude: 25.63322525 }
  ]


  return (
    <View style={styles.container}>
      
      <MapView style={styles.map} region={location} showsUserLocation={true}>
        {/*<Polygon coordinates={coords} fillColor='red'></Polygon>*/}
        <Polygon coordinates={cell1} fillColor='#ff000040' />
        <Polygon coordinates={cell2} fillColor='#00ff0040' />
        <Polygon coordinates={cell3} fillColor='#0000ff40' />
        <Polygon coordinates={cell4} fillColor='#ffff0040' />

        <Polygon coordinates={cell5} fillColor='#ff000040' />
        <Polygon coordinates={cell6} fillColor='#00ff0040' />
        <Polygon coordinates={cell7} fillColor='#0000ff40' />
        <Polygon coordinates={cell8} fillColor='#ffff0040' />

        <Polygon coordinates={cell9} fillColor='#ff000040' />
        <Polygon coordinates={cell10} fillColor='#00ff0040' />
        <Polygon coordinates={cell11} fillColor='#0000ff40' />
        <Polygon coordinates={cell12} fillColor='#ffff0040' />

        <Polygon coordinates={cell13} fillColor='#ff000040' />
        <Polygon coordinates={cell14} fillColor='#00ff0040' />
        <Polygon coordinates={cell15} fillColor='#0000ff40' />
        <Polygon coordinates={cell16} fillColor='#ffff0040' />

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});