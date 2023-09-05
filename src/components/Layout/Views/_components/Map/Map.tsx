import React, { useState } from 'react'
import { YMaps, Map as MapYandex, ZoomControl, Clusterer, Placemark, ObjectManager } from 'react-yandex-maps'
import { svgVariables } from 'constants/common'

import classes from './Map.module.scss'
import cn from 'classnames'
import { isCurrentPath } from 'utils'

export interface IDataMap {
  latitude: number
  longitude: number
  title: string
  id: number
  onClick?: (e: any) => void
}

type Props = {
  data: IDataMap[]
}

const Map: React.FC<Props> = ({ data }) => {
  const isMap = isCurrentPath(['Map'])
  const placemarks = (
    <MapYandex
      state={{ center: [41.307145, 69.25153], zoom: 13 }}
      className={cn(classes.map, { [classes.isNotMap]: !isMap })}
    >
      <ObjectManager />
      <Clusterer
        options={{
          preset: 'islands#darkGreenClusterIcons',
          gridSize: 50,
          groupByCoordinates: true,
        }}
      >
        {data.map(
          ({ latitude, longitude, title, id, onClick }) =>
            latitude &&
            longitude && (
              <Placemark
                onClick={onClick}
                key={id}
                geometry={[Number(latitude), Number(longitude)]}
                options={{
                  preset: 'islands#circleDotIcon',
                  iconColor: svgVariables.$blue,
                }}
                properties={{
                  hintContent: title,
                  balloonContent: title,
                }}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              />
            ),
        )}
      </Clusterer>
      <ZoomControl options={{ position: { right: 10, top: 100 } }} />
      {/* <GeolocationControl
          data={{ title: "kalsjdfkljsd" }}
          options={{
            float: "left",
          }}
        /> */}
    </MapYandex>
  )
  return (
    <div className="fade">
      <YMaps>{placemarks}</YMaps>
    </div>
  )
}

export default Map
