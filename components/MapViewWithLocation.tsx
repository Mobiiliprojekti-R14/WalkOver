import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import MapView, { Polygon, Polyline, LatLng, Region, MapPressEvent, PoiClickEvent } from 'react-native-maps'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import PedometerComponent from './PedometerComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import cells4 from '../cells4.json'
import { onMapLoad, CellUserData } from '../src/utils/fetchCellData'
import { setOpacity } from '../src/utils/colorStrings'
import CellInfoModal from './CellInfoModal'
import { IconButton } from 'react-native-paper'
import StepsInCell from './StepsInCell'

type CellGeoData = {
  country: string,
  city: string,
  name?: string,
  coords: LatLng[]
}

//const coords = [{ latitude: 65.01, longitude: 25.5 }, { latitude: 65.03, longitude: 25.7 }, { latitude: 65.04, longitude: 25.3 }] //tän voi varmaan poistaa?
//const coords2 = [{ latitude: 65.089615, longitude: 25.377071 }, { latitude: 65.08917, longitude: 25.71861 }, { latitude: 64.94528, longitude: 25.71861 }, { latitude: 64.94583, longitude: 25.37694 }] // Koko pelialue

/*
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
*/
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
/*
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
        //console.log("piste on cellissä ", i + 1)
        cellIndex = i + 1
        break
      }
    }

    return cellIndex
  }
*/
const findCell4 = (coordinate: LatLng, cellList: CellGeoData[]): number => {
  //palauttaa cellin numeron, jonka sisälle piste kuuluu. Jos piste ei kuulu minkään cellin sisälle, palauttaa -1

  for (let i = 0; i < cellList.length; i++) {
    if (isInsideCell(coordinate, cellList[i].coords)) {
      console.log("piste on cellissä ", i + 1)
      return i + 1
    }
  }

  //piste on pelialueen ulkopuolella
  console.log("koordinaatti on pelialueen ulkopuolella")

  return -1
}

const LOCATION_TASK_NAME = 'background-location-task'

//Taustasijainnin käsittelijä
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  console.log("Taskmanager")
  if (error) {

    console.error('Background task error:', error)
    return
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] }
    const latest = locations[0].coords
    const coord = { latitude: latest.latitude, longitude: latest.longitude }
    const BGcellNumber = findCell4(coord, cells4)
    await AsyncStorage.setItem("currentCell", String(BGcellNumber))

    const prev = await AsyncStorage.getItem("route")
    const route = prev ? JSON.parse(prev) : []
    route.push(coord)
    await AsyncStorage.setItem("route", JSON.stringify(route))

    console.log("BG User is in cell:", BGcellNumber)
    //console.log('Background locations:', locations) //Kommentoi pois jos haluat nähdä sijaintilokeja
  }
})

export default function MapViewWithLocation() {

  // Poistetaan vanha task jos sellainen on päällä
  useEffect(() => {
    const stopOldTask = async () => {
      // Anna Expon rekisteröityä ensin
      await new Promise(res => setTimeout(res, 300))

      const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
      console.log("Käynnistyksessä, onko taustatehtävä käynnissä:", running)

      if (running) {
        console.log("Pysäytetään vanha taustatehtävä")
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
      }
    }

    stopOldTask()
  }, [])


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

  // Onko käyttäjä painanut Pelaa-nappia
  const [isPlaying, setIsPlaying] = useState(false)

  // Kartan ref (animateToRegion varten)
  const mapRef = useRef<MapView>(null)

  // marker ref (väliaikainen testi)
  //const markerRef = useRef<MapMarker>(null)

  //cell info modal
  const [modalVisible, setModalVisible] = useState(false)

  const [cellNumber, setCellNumber] = useState<number>(-1)

  //tilamuuttujat debuggaamiseen (voi poistaa myöhemmästä toteutuksesta)
  const [debugCoords, setDebugCoords] = useState<LatLng>()
  const [debugCell, setDebugCell] = useState<number>(-1)
  const [debugText, setDebugText] = useState<string>("")

  //tähän tallennetaan lista objekteista, joissa on cellin alueella liikkuneiden tiedot (haetaan tietokannasta)
  const [cellUserData, setCellUserData] = useState<CellUserData[] | undefined>([])

  const [isFetchingData, setIsFetchingData] = useState(false)
  const [previousFetch, setPreviousFetch] = useState(0)

  useEffect(() => {
    (async () => {
      if (isFetchingData) return; //estää usean samanaikaisen haun (toivottavasti... :D)
      if (Date.now() - previousFetch < 60000) return; //rajoittaa sitä, kuinka usein cellien tiedot voidaan hakea (enintään kerran 60 sekunnissa)
      setIsFetchingData(true)
      const cellDataList = await onMapLoad();
      setCellUserData(cellDataList)
      setPreviousFetch(Date.now())
      setIsFetchingData(false)
    })()
  }, [cellUserData])
  // Reitti tyhjennetään kun käyttäjä lopettaa pelaamisen
  useEffect(() => {
    if (!isPlaying) {
      AsyncStorage.removeItem("route")
      setRouteCoords([])
    }
  }, [isPlaying])



  useEffect(() => {
    const interval = setInterval(async () => {
      const stored = await AsyncStorage.getItem("currentCell")
      if (stored) setCellNumber(Number(stored))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Reitin piirtäminen backgroundissa
  useEffect(() => {
    const interval = setInterval(async () => {
      const storedRoute = await AsyncStorage.getItem("route")
      if (storedRoute) {
        setRouteCoords(JSON.parse(storedRoute))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])



  // Ensimmäisen sijainnin haku heti kun karttanäkymä avataan
  useEffect(() => {
    (async () => {
      // Pyydetään foreground‑lupa
      const { status: fg } = await Location.requestForegroundPermissionsAsync()
      if (fg !== 'granted') return

      // Pyydetään background‑lupa
      const { status: bg } = await Location.requestBackgroundPermissionsAsync()
      if (bg !== 'granted') return


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

    })()
  }, [])

  // Sijainnin päivitys backgroundissa (kun käyttäjä pelaa)
  useEffect(() => {
    const toggleTracking = async () => {
      if (isPlaying) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 0.1, // TÄTÄ SUUREMMAKSI MYÖHEMMIN, TESTIVAIHEESSA SAADAAN ENEMMÄN SIJAINTIPÄIVITYKSIÄ
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Tracking location',
            notificationBody: 'Your location is being tracked',
          },
        })
        console.log("Taustaseuranta käynnissä")
      } else {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
        console.log("Taustaseuranta pysäytetty")
      }
    }

    toggleTracking()
  }, [isPlaying])

  // Sijainnin päivitys foregroundissa (kun käyttäjä pelaa)
  const watchRef = useRef<Location.LocationSubscription | null>(null)

  useEffect(() => {
    const manageWatch = async () => {
      if (isPlaying) {
        const sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 2000,
            distanceInterval: 0.1, // TÄTÄ SUUREMMAKSI MYÖHEMMIN, TESTIVAIHEESSA SAADAAN ENEMMÄN SIJAINTIPÄIVITYKSIÄ
          },
          (pos) => {
            const { latitude, longitude } = pos.coords
            setCurrentLocation({ latitude, longitude })
            setRouteCoords((prev) => [...prev, { latitude, longitude }])
            const FGcellNumber = findCell4({ latitude, longitude }, cells4)
            console.log("FG User is in cell:", FGcellNumber)
          }
        )
        watchRef.current = sub
      } else {
        if (watchRef.current) {
          watchRef.current.remove()
          watchRef.current = null
        }
      }
    }

    manageWatch()
  }, [isPlaying])

  // Lopetetaan sijainnin haku kun sovellus suljetaan (ei jää kuluttamaan akkua)
  useEffect(() => {
    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
    }
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
  if (!initialRegion) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ margin: 8 }}>Fetching location...</Text>
      <ActivityIndicator />
    </View>
  )

  /*
  const coords2 = [{ latitude: 65.089615, longitude: 25.377071 }, { latitude: 65.08917, longitude: 25.71861 }, { latitude: 64.94528, longitude: 25.71861 }, { latitude: 64.94583, longitude: 25.37694 }] // Koko pelialue

  const oulu1_v4: LatLng[] = cells4[0].coords
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
  */

  //väliaikainen kunnes cellin väri haetaan tietokannasta käyttäjän värin perusteella
  //const cellColors: string[] = ["#ff000040", "#00ff0040", "#0000ff40", "#ffff0040"]

  /*const findCell = (coordinate: LatLng): number => {
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
  }*/

  /*
  const findCell4 = (coordinate: LatLng, cellList: CellData2[]): number => {
    //palauttaa cellin numeron, jonka sisälle piste kuuluu. Jos piste ei kuulu minkään cellin sisälle, palauttaa -1

    for (let i = 0; i < cellList.length; i++) {
      if (isInsideCell(coordinate, cellList[i].coords)) {
        console.log("piste on cellissä ", i + 1)
        return i + 1
      }
    }

    //piste on pelialueen ulkopuolella
    console.log("koordinaatti on pelialueen ulkopuolella")

    return -1
  }
  */

  const handleMapPress = /*async*/ (e: MapPressEvent | PoiClickEvent) => {
    const onPressCoords = e.nativeEvent.coordinate
    setDebugCoords(onPressCoords)
    setDebugText("Latitude: " + String(onPressCoords.latitude) + ", Longitude: " + String(onPressCoords.longitude))

    //const cellNumber = findCell(onPressCoords)
    const cellNumber = findCell4(onPressCoords, cells4)
    setDebugCell(cellNumber)

    if (cellNumber > -1) {
      /*await*/ //getCellUserData(cellNumber)
      setModalVisible(true)
    }

    setIsFollowing(false)
    setLastInteraction(Date.now())
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        loadingEnabled={true}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onRegionChangeComplete={() => {
          setIsFollowing(false)
          setLastInteraction(Date.now())
        }}
        onPress={(e) => handleMapPress(e)}
        onPoiClick={(e) => handleMapPress(e)}
      >
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#007AFF"
          />
        )}

        {
          cells4.map((cell, index) => {
            return <Polygon
              key={index}
              coordinates={cell.coords}
              //fillColor={cellColors[index % 4]}
              //fillColor={cellUserData ? cellUserData[index]?.firstColor ? setOpacity(cellUserData[index]?.firstColor, "40") : '#0000' : '#0000'}
              fillColor={cellUserData && cellUserData[index] && cellUserData[index].firstColor ? setOpacity(cellUserData[index].firstColor, "40", "#0000") : '#0000'}
            />
          })
        }


        {/*
        <Polygon coordinates={cell1} fillColor="#ff000040" tappable={true} onPress={(e) => {
          console.log("polygon onpress")

        }}/>
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
        */}

        {/* debug marker, voi poistaa myöhemmästä toteutuksesta! */}
        {/*debugCoords ? (
          <Marker coordinate={debugCoords} opacity={1} ref={markerRef} title='test title' description='test description' icon={4} />
        ) : null*/}

      </MapView>

      {isFetchingData || !cellUserData/* || true*/ ?
        <View style={{ position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.6)', margin: 8, padding: 16 }}>
          <Text style={{ paddingBottom: 8 }}>Loading latest cell data...</Text>
          <ActivityIndicator />
        </View> : null
      }

      <CellInfoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        cellUserData={cellUserData}
        debugCell={debugCell}
      />

      {isPlaying && <PedometerComponent cellNumber={cellNumber} />}

      {/* debug tekstit karttanäkymän alla, voi poistaa myöhemmästä toteutuksesta! */}
      {/*<Text>{debugText}</Text>*/}
      {/*<Text>cell: {debugCell}</Text>*/}
      <StepsInCell cellNumber={cellNumber} />


      <TouchableOpacity
        style={styles.playButton}
        onPress={() => setIsPlaying(prev => !prev)}
      >
        <Text style={styles.playText}>
          {isPlaying ? "Stop playing" : "Start playing"}
        </Text>
      </TouchableOpacity>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '80%', //karttanäkymän korkeutta alennettu hieman, jotta debug tekstit saa näkyviin sen alapuolelle (väliaikainen)
  },
  playButton: {
    position: "absolute",
    bottom: 150,
    left: 70,
    right: 70,
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  playText: {
    fontSize: 20,
    color: "white"
  },/*
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },*/
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})