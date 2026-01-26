import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import MapView, { Polygon, Polyline, LatLng, Region } from 'react-native-maps'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

const LOCATION_TASK_NAME = 'background-location-task'

// Taustasijainnin käsittelijä
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background task error:', error)
    return
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] }
     //console.log('Background locations:', locations) //Kommentoi pois jos haluat nähdä sijaintilokeja
  }
})

export default function MapViewWithLocation() {
  // Ensimmäinen alue kartalle (initialRegion)
  const [initialRegion, setInitialRegion] = useState<Region | null>(null)

  // Reitti
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([])

  // Viimeisin sijainti
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)

  // Seurataanko käyttäjää
  const [isFollowing, setIsFollowing] = useState(true)

  // Milloin käyttäjä viimeksi liikutti karttaa
  const [lastInteraction, setLastInteraction] = useState(Date.now())

  // Kartan ref (animateToRegion varten)
  const mapRef = useRef<MapView>(null)


  useEffect(() => {
    (async () => {
      // Pyydetään foreground‑lupa
      const { status: fg } = await Location.requestForegroundPermissionsAsync()
      if (fg !== 'granted') return

      // Pyydetään background‑lupa
      const { status: bg } = await Location.requestBackgroundPermissionsAsync()
      if (bg !== 'granted') return

      // Käynnistetään sijainnin haku
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 2000,
        distanceInterval: 0.1, // TÄTÄ SUUREMMAKSI MYÖHEMMIN, TESTAAMISESSA SAA ENEMMÄN PÄIVITYKSIÄ
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Tracking location',
          notificationBody: 'Your location is being tracked',
        },
      })

      // Haetaan ensimmäinen sijainti kartan keskitystä varten
      const loc = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = loc.coords

      // Asetetaan kartan aloitusalue
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })

      setCurrentLocation({ latitude, longitude })
      setRouteCoords([{ latitude, longitude }])

      // Reaaliaikainen seuranta
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 0.1, // TÄTÄ SUUREMMAKSI MYÖHEMMIN, TESTAAMISESSA SAA ENEMMÄN PÄIVITYKSIÄ
        },
        (pos) => {
          const { latitude, longitude } = pos.coords

          setCurrentLocation({ latitude, longitude })
          setRouteCoords((prev) => [...prev, { latitude, longitude }])
        }
      )

      // Siivous kun komponentti unmountataan
      return () => sub.remove()
    })()
  }, [])


  // Keskitetään kartta käyttäjään
  useEffect(() => {
    if (!isFollowing || !currentLocation || !mapRef.current) return

    mapRef.current.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  }, [currentLocation, isFollowing])


  // Automaattinen seurannan palautus 5s jälkeen
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      if (!isFollowing && now - lastInteraction > 5000) {
        setIsFollowing(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isFollowing, lastInteraction])

  // Ei piirretä karttaa ennen initialRegionia
  if (!initialRegion) return null


  const cell1: LatLng[] = [
    { latitude: 65.089615, longitude: 25.377071 },
    { latitude: 65.089615, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.377071 },
  ]

  const cell2: LatLng[] = [
    { latitude: 65.089615, longitude: 25.46245575 },
    { latitude: 65.089615, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.46245575 },
  ]

  const cell3: LatLng[] = [
    { latitude: 65.089615, longitude: 25.5478405 },
    { latitude: 65.089615, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.5478405 },
  ]

  const cell4: LatLng[] = [
    { latitude: 65.089615, longitude: 25.63322525 },
    { latitude: 65.089615, longitude: 25.71861 },
    { latitude: 65.05366875, longitude: 25.71861 },
    { latitude: 65.05366875, longitude: 25.63322525 },
  ]

  const cell5: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.377071 },
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.377071 },
  ]

  const cell6: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.46245575 },
  ]

  const cell7: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.5478405 },
  ]

  const cell8: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.71861 },
    { latitude: 65.0177225, longitude: 25.71861 },
    { latitude: 65.0177225, longitude: 25.63322525 },
  ]

  const cell9: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.377071 },
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.377071 },
  ]

  const cell10: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.46245575 },
  ]

  const cell11: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.5478405 },
  ]

  const cell12: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.71861 },
    { latitude: 64.98177625, longitude: 25.71861 },
    { latitude: 64.98177625, longitude: 25.63322525 },
  ]

  const cell13: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.377071 },
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.94583, longitude: 25.46245575 },
    { latitude: 64.94583, longitude: 25.377071 },
  ]

  const cell14: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.94583, longitude: 25.5478405 },
    { latitude: 64.94583, longitude: 25.46245575 },
  ]

  const cell15: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.94583, longitude: 25.63322525 },
    { latitude: 64.94583, longitude: 25.5478405 },
  ]

  const cell16: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.71861 },
    { latitude: 64.94583, longitude: 25.71861 },
    { latitude: 64.94583, longitude: 25.63322525 },
  ]


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        onRegionChangeComplete={() => {
          setIsFollowing(false)
          setLastInteraction(Date.now())
        }}
      >
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#007AFF"
          />
        )}

        <Polygon coordinates={cell1} fillColor="#ff000040" />
        <Polygon coordinates={cell2} fillColor="#00ff0040" />
        <Polygon coordinates={cell3} fillColor="#0000ff40" />
        <Polygon coordinates={cell4} fillColor="#ffff0040" />

        <Polygon coordinates={cell5} fillColor="#ff000040" />
        <Polygon coordinates={cell6} fillColor="#00ff0040" />
        <Polygon coordinates={cell7} fillColor="#0000ff40" />
        <Polygon coordinates={cell8} fillColor="#ffff0040" />

        <Polygon coordinates={cell9} fillColor="#ff000040" />
        <Polygon coordinates={cell10} fillColor="#00ff0040" />
        <Polygon coordinates={cell11} fillColor="#0000ff40" />
        <Polygon coordinates={cell12} fillColor="#ffff0040" />

        <Polygon coordinates={cell13} fillColor="#ff000040" />
        <Polygon coordinates={cell14} fillColor="#00ff0040" />
        <Polygon coordinates={cell15} fillColor="#0000ff40" />
        <Polygon coordinates={cell16} fillColor="#ffff0040" />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})

