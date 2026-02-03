import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
//import MapView, { Polygon, Polyline, LatLng as LL, Region, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { Camera, CameraRef, MapView as MV, MapViewRef, UserLocation, Logger as MapLibreLogger } from '@maplibre/maplibre-react-native'

import MapLibreCell from './MapLibreCell'
import cells from '../src/assets/geojson/cells/oulu.json'

type LatLng = {
  latitude: number,
  longitude: number
}

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

MapLibreLogger.setLogCallback(log => {
  //  ilman tätä konsoliin lokittuu jatkuvasti ilmoituksia 
  //  kts. -->  https://github.com/rnmapbox/maps/issues/943#issuecomment-759220852
  //            https://github.com/maplibre/maplibre-react-native/issues/368
  const { message } = log

  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true
  }
  return false
})

export default function MapViewWithLocation() {
  // Ensimmäinen alue kartalle (initialRegion)
  const [initialRegion, setInitialRegion] = useState<LatLng | null>(null)

  // Reitti
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([])

  // Viimeisin sijainti
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)

  // Seurataanko käyttäjää
  const [isFollowing, setIsFollowing] = useState(true)

  // Milloin käyttäjä viimeksi liikutti karttaa
  const [lastInteraction, setLastInteraction] = useState(Date.now())

  // Kartan ref (animateToRegion varten)
  const mapRef = useRef<MapViewRef>(null)
  const cameraRef = useRef<CameraRef>(null)

  //tilamuuttujat debuggaamiseen (voi poistaa myöhemmästä toteutuksesta)
  const [debugCoords, setDebugCoords] = useState<LatLng>()
  const [debugCell, setDebugCell] = useState<number>(-1)
  const [debugText, setDebugText] = useState<string>("")

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
        longitude
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
    console.log("useeffect keskitetään kartta käyttäjään")
    if (!isFollowing || !currentLocation || !cameraRef.current || !mapRef.current) return

    cameraRef?.current?.moveTo(
      [currentLocation.longitude, currentLocation.latitude], 500
    )
  }, [currentLocation, isFollowing])


  // Automaattinen seurannan palautus 5s jälkeen
  useEffect(() => {
    console.log("useeffect seurannan palautus")
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

  const coords2 = [{ latitude: 65.089615, longitude: 25.377071 }, { latitude: 65.08917, longitude: 25.71861 }, { latitude: 64.94528, longitude: 25.71861 }, { latitude: 64.94583, longitude: 25.37694 }] // Koko pelialue


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

  const isInsideCell = (coordinate: LatLng, cell: LatLng[]): boolean => {
    //palauttaa true, jos käsiteltävä piste (coordinate-parametri) on alueen (cell-parametri) sisällä, muuten palauttaa false
    //lähinnä apufunktio alempana määritellylle findCell-funktiolle

    const latitudes = cell.map((point) => { return point.latitude })
    const longitudes = cell.map((point) => { return point.longitude })

    const latMin = Math.min(...latitudes)
    const latMax = Math.max(...latitudes)
    const longMin = Math.min(...longitudes)
    const longMax = Math.max(...longitudes)

    if (coordinate.latitude <= latMin) {
      //piste on cellin alareunan alapuolella
      return false
    }
    else if (coordinate.latitude >= latMax) {
      //piste on cellin yläreunan yläpuolella
      return false
    }
    else if (coordinate.longitude <= longMin) {
      //piste on cellin vasemman reunan vasemmalla puolella
      return false
    }
    else if (coordinate.longitude >= longMax) {
      //piste on cellin oikean reunan oikealla puolella
      return false
    }
    else {
      //käsitelty kaikki tapaukset, joissa piste on alueen ulkopuolella, joten pisteen täytyy olla alueen sisällä
      return true
    }
  }

  const findCell = (coordinate: LatLng): number => {
    //palauttaa cellin numeron, jonka sisälle piste kuuluu. Jos piste ei kuulu minkään cellin sisälle, palauttaa -1

    let cellIndex = -1

    if (!isInsideCell(coordinate, coords2)) {//coords2 on koko pelialue (käytännössä iso celli)
      //piste on pelialueen ulkopuolella
      console.log("koordinaatti on pelialueen ulkopuolella")
      return cellIndex
    }

    const cells = [
      cell1, cell2, cell3, cell4,
      cell5, cell6, cell7, cell8,
      cell9, cell10, cell11, cell12,
      cell13, cell14, cell15, cell16
    ] //en keksinyt parempaa tapaa cellien läpi looppaamiseen kuin lisäämällä ne ensin listaan

    for (let i = 0; i < cells.length; i++) {
      if (isInsideCell(coordinate, cells[i])) {
        console.log("piste on cellissä ", i + 1)
        cellIndex = i + 1
        break
      }
    }

    return cellIndex
  }

  return (
    <View style={styles.container}>
      <MV
        style={styles.map}
        mapStyle={"https://tiles.openfreemap.org/styles/liberty"} //positron/bright/liberty (https://openfreemap.org/quick_start/)
        ref={mapRef}
        onDidFinishLoadingMap={() => {
          console.log("finished loading map")
          //cameraRef?.current?.setCamera({})
        }}
        onRegionWillChange={() => {
          //cameraRef?.current?.setCamera({})
        }}
        onRegionDidChange={() => {
          cameraRef?.current?.setCamera({})
          //setIsFollowing(false)
          //setLastInteraction(Date.now())
          //console.log("region changed")
        }}
        
        onPress={async (e) => {
          const zoom = await mapRef?.current?.getZoom()
          const center = await mapRef?.current?.getCenter()
          const clicked = e.geometry
          console.log("zoom: ", zoom)
          console.log(clicked)
        }}
      >
        
        <Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
          animationDuration={0}
        />

        {cells.features.map((feature, index) => {
          return (
            <MapLibreCell
              key={feature.id}
              feature={feature}
              mapviewRef={mapRef}
              cameraRef={cameraRef}
              index={index}
            />
          )
        })}

        <UserLocation
        />
      </MV>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%', //karttanäkymän korkeutta alennettu hieman, jotta debug tekstit saa näkyviin sen alapuolelle (väliaikainen)
  },
})

