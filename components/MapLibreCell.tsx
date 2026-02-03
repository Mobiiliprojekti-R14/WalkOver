
import { FillLayer, LineLayer, ShapeSource } from '@maplibre/maplibre-react-native'
import React, { useState } from 'react'

export default function MapLibreCell({ feature, index }: any) {

  const [isVisible, setIsVisible] = useState<boolean>(false)

  const cellColors = [
    '#000000', '#0000ff',
    '#00ff00', '#00ffff',
    '#ff0000', '#ff00ff',
    '#ffff00', '#ffffff'
  ]

  return (
    <ShapeSource
      id={feature.id}
      shape={feature as GeoJSON.Feature}
      onPress={async (e) => {
        setIsVisible(!isVisible)
      }}
    >
      <FillLayer
        id={`${feature.id}_filled`}
        style={{ fillOpacity: isVisible ? 0.5 : 0, fillColor: cellColors[index % 8] }}
      />
      <LineLayer
        id={`${feature.id}_outline`}
        style={{ lineWidth: 2 }}
      />
    </ShapeSource>
  )
}