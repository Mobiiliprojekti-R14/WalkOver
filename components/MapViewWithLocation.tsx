import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Polygon, Region, Polyline, LatLng, Marker } from 'react-native-maps'
import * as Location from 'expo-location'




export default function MapViewWithLocation() {


  const [region, setRegion] = useState<Region | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);

  //tilamuuttujat debuggaamiseen (voi poistaa myöhemmästä toteutuksesta)
  const [debugCoords, setDebugCoords] = useState<LatLng>()
  const [debugCell, setDebugCell] = useState<number>(-1)
  const [debugText, setDebugText] = useState<string>("")

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setRouteCoords((prev) => [...prev, { latitude, longitude }]);
          //setRegion((r) => r ? { ...r, latitude, longitude, } : null ) //<-- tämä rivi aiheuttaa kartan uudelleenzoomauksen?
        }
      );

      return () => sub.remove();
    })();
  }, []);

  if (!region) return null;

  const coords = [{ latitude: 65.01, longitude: 25.5 }, { latitude: 65.03, longitude: 25.7 }, { latitude: 65.04, longitude: 25.3 }] //tän voi varmaan poistaa?
  const coords2 = [{ latitude: 65.089615, longitude: 25.377071 }, { latitude: 65.08917, longitude: 25.71861 }, { latitude: 64.94528, longitude: 25.71861 }, { latitude: 64.94583, longitude: 25.37694 }] // Koko pelialue


  const cell1: LatLng[] = [
    { latitude: 65.089615, longitude: 25.377071 },
    { latitude: 65.089615, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.377071 }
  ]

  const cell2: LatLng[] = [
    { latitude: 65.089615, longitude: 25.46245575 },
    { latitude: 65.089615, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.46245575 }
  ]

  const cell3: LatLng[] = [
    { latitude: 65.089615, longitude: 25.5478405 },
    { latitude: 65.089615, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.5478405 }
  ]

  const cell4: LatLng[] = [
    { latitude: 65.089615, longitude: 25.63322525 },
    { latitude: 65.089615, longitude: 25.71861 },
    { latitude: 65.05366875, longitude: 25.71861 },
    { latitude: 65.05366875, longitude: 25.63322525 }
  ]

  const cell5: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.377071 },
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.377071 }
  ]

  const cell6: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.46245575 },
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.46245575 }
  ]

  const cell7: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.5478405 },
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.5478405 }
  ]

  const cell8: LatLng[] = [
    { latitude: 65.05366875, longitude: 25.63322525 },
    { latitude: 65.05366875, longitude: 25.71861 },
    { latitude: 65.0177225, longitude: 25.71861 },
    { latitude: 65.0177225, longitude: 25.63322525 }
  ]

  const cell9: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.377071 },
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.377071 }
  ]

  const cell10: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.46245575 },
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.46245575 }
  ]

  const cell11: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.5478405 },
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.5478405 }
  ]

  const cell12: LatLng[] = [
    { latitude: 65.0177225, longitude: 25.63322525 },
    { latitude: 65.0177225, longitude: 25.71861 },
    { latitude: 64.98177625, longitude: 25.71861 },
    { latitude: 64.98177625, longitude: 25.63322525 }
  ]

  const cell13: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.377071 },
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.94583, longitude: 25.46245575 },
    { latitude: 64.94583, longitude: 25.377071 }
  ]

  const cell14: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.46245575 },
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.94583, longitude: 25.5478405 },
    { latitude: 64.94583, longitude: 25.46245575 }
  ]

  const cell15: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.5478405 },
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.94583, longitude: 25.63322525 },
    { latitude: 64.94583, longitude: 25.5478405 }
  ]

  const cell16: LatLng[] = [
    { latitude: 64.98177625, longitude: 25.63322525 },
    { latitude: 64.98177625, longitude: 25.71861 },
    { latitude: 64.94583, longitude: 25.71861 },
    { latitude: 64.94583, longitude: 25.63322525 }
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

    for (let i = 0; i<cells.length; i++) {
      if (isInsideCell(coordinate, cells[i])) {
        console.log("piste on cellissä ", i+1)
        cellIndex = i+1
        break
      }
    }

    return cellIndex
  }

  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onPress={(e) => {
          const onPressCoords = e.nativeEvent.coordinate
          setDebugCoords(onPressCoords)
          setDebugText("Latitude: " + String(onPressCoords.latitude) + ", Longitude: " + String(onPressCoords.longitude))

          const cellNumber = findCell(onPressCoords)
          setDebugCell(cellNumber)
        }}
        onPoiClick={(e) => {
          const onPressCoords = e.nativeEvent.coordinate
          setDebugCoords(onPressCoords)
          setDebugText("Latitude: " + String(onPressCoords.latitude) + ", Longitude: " + String(onPressCoords.longitude))

          const cellNumber = findCell(onPressCoords)
          setDebugCell(cellNumber)
        }}
      >
        {routeCoords.length > 0 && (
          <>
            <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#007AFF" />

          </>
        )}
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

        {/* debug marker, voi poistaa myöhemmästä toteutuksesta! */}
        {debugCoords ? <Marker coordinate={debugCoords} /> : null}

      </MapView>

      {/* debug tekstit karttanäkymän alla, voi poistaa myöhemmästä toteutuksesta! */}
      <Text>{debugText}</Text>
      <Text>cell: {debugCell}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%', //karttanäkymän korkeutta alennettu hieman, jotta debug tekstit saa näkyviin sen alapuolelle (väliaikainen)
  },
});