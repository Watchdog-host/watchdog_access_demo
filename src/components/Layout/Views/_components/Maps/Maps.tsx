import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { svgVariables } from 'constants/common'
import classes from './Maps.module.scss'
import cn from 'classnames'
import { isCurrentPath } from 'utils'
// import { YMaps, Map as MapYandex, Placemark, ObjectManager, Clusterer, ZoomControl, useYMaps } from '@pbe/react-yandex-maps';
import { useEdgePathQuery } from 'store/endpoints'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { IEdgeDTO } from 'types'
import { Map, Marker, ZoomControl } from 'pigeon-maps'

import Hover from './_components/Hover/Hover'
import Tooltip from './_components/Tooltip/Tooltip'
import { EdgeStatusEnum } from 'constants/enums'
import { Badge } from 'antd'
import { Minus, Plus } from 'tabler-icons-react'

type TooltipType = {
  clicked: boolean
  hovered: boolean
  x: number
  y: number
  data: IEdgeDTO | null
}
type Props = {}

const Maps: React.FC<Props> = ({}) => {
  const isMap = isCurrentPath(['Map'])
  const { data: edgePathData, refetch, isSuccess } = useEdgePathQuery()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [tooltip, setTooltip] = useState<TooltipType>({ clicked: false, hovered: false, x: 0, y: 0, data: null })
  const [edges, setEdges] = useState<IEdgeDTO[]>([])
  const [zoom, setZoom] = useState(12)

  function flattenObject(obj: IEdgeDTO | undefined): IEdgeDTO[] {
    let result: IEdgeDTO[] = []
    if (obj) {
      result.push(obj)
      if (obj.children && Array.isArray(obj.children)) {
        for (const child of obj.children) {
          result = result.concat(flattenObject(child))
        }
      }
    }
    return result
  }

  useEffect(() => {
    refetch()
    setEdges(flattenObject(edgePathData)?.map((edge) => ({ ...edge, status: null })) ?? [])
  }, [isSuccess, currentEdge])

  useEffect(() => {
    const calculateEdgeStatus = (statusResponse: { degraded_devices: number; offline_devices: number }): EdgeStatusEnum | null => {
      const { offline_devices, degraded_devices } = statusResponse

      if (offline_devices === 0 && degraded_devices === 0) {
        return EdgeStatusEnum.Online
      } else if (degraded_devices > 0 || offline_devices > 0) {
        return EdgeStatusEnum.Degraded
      }
      return null
    }

    const fetchEdgeStatus = async () => {
      const edgesArray = flattenObject(edgePathData) || []
      const updatedEdges: IEdgeDTO[] = []

      for (const edge of edgesArray) {
        try {
          const response: Response = await Promise.race([
            fetch(`${edge.public_ip}/api/v1/edge/status`),
            new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 5000)),
          ])
          if (response.ok) {
            const data = await response.json()
            const updatedEdge = {
              ...edge,
              status: { ...data, edge_status: calculateEdgeStatus(data) },
            }
            updatedEdges.push(updatedEdge)
          } else {
            const updatedEdge = { ...edge, status: null }
            updatedEdges.push(updatedEdge)
          }
        } catch (error) {
          const updatedEdge = { ...edge, status: null }
          updatedEdges.push(updatedEdge)
        }
      }
      setEdges(updatedEdges)
    }

    fetchEdgeStatus()
    const intervalId = setInterval(fetchEdgeStatus, 30000)
    return () => {
      clearInterval(intervalId)
    }
  }, [isSuccess, currentEdge])

  // const placemarks = (
  //   <MapYandex
  //     state={{ center: [41.307145, 69.25153], zoom: 13 }}
  //     className={cn(classes.map, { [classes.isNotMap]: !isMap })}
  //   >
  //     <ObjectManager />
  //     <Clusterer
  //       options={{
  //         preset: 'islands#darkGreenClusterIcons',
  //         gridSize: 50,
  //         groupByCoordinates: true,
  //       }}
  //     >
  //       {mapData?.map(
  //         (item) =>
  //           item.latitude &&
  //           item.longitude && (
  //             <Placemark
  //               // onClick={() => handleClick(item)}
  //               key={item.id}
  //               geometry={[Number(item.latitude), Number(item.longitude)]}
  //               options={{
  //                 preset: 'islands#circleDotIcon',
  //                 iconColor: svgVariables.$blue,
  //               }}
  //               properties={{
  //                 hintContent: item.title,
  //                 balloonContent: item.title
  //               }}
  //               modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
  //             />
  //           ),
  //       )}
  //     </Clusterer>
  //     <ZoomControl options={{ position: { right: 10, top: 100 } }} />
  //     {/* <GeolocationControl
  //           data={{ title: "kalsjdfkljsd" }}
  //           options={{
  //             float: "left",
  //           }}
  //         /> */}
  //   </MapYandex>
  // )
  const handleHoverMarker = (e: any, item: IEdgeDTO) => {
    setTooltip((prev) => ({
      ...prev,
      hovered: true,
      clicked: false,
      x: e.event.clientX,
      y: e.event.clientY,
      data: item,
    }))
  }

  const handleClickMarker = (e: any, item: IEdgeDTO) => {
    setTooltip((prev) => ({
      ...prev,
      clicked: true,
      hovered: false,
      x: e.event.clientX,
      y: e.event.clientY,
      data: item,
    }))
  }

  const handleOutMarker = () => {
    if (!tooltip.clicked) {
      setTooltip((prev) => ({ ...prev, hovered: false }))
    }
  }

  const handleZoomIn = () => {
    if (zoom < 23) {
      setZoom((prev) => prev + 1)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 4) {
      setZoom((prev) => prev - 1)
    }
  }

  const map = currentEdge ? (
    <Map defaultZoom={12} zoom={zoom} center={[currentEdge.latitude, currentEdge.longitude]} defaultCenter={[currentEdge.latitude, currentEdge.longitude]}>
      {/* <ZoomControl style={ {position:'absolute',left: '100%', top: 20 ,transform:'translateX(-100%)'}} /> */}

      <div className={classes.zoomControl}>
        <div className={zoom == 23 ? classes.disabled : ''} onClick={handleZoomIn}>
          <Plus size={20} color={zoom == 23 ? svgVariables.$darkGray : svgVariables.$dark} />
        </div>
        <div className={zoom == 4 ? classes.disabled : ''} onClick={handleZoomOut}>
          <Minus size={20} color={zoom == 4 ? svgVariables.$darkGray : svgVariables.$dark} />
        </div>
      </div>

      {edges?.map((item) => {
        const { latitude, longitude } = item
        if (!latitude || !longitude) return null

        return (
          <Marker
            key={item.id}
            width={40}
            onMouseOut={handleOutMarker}
            onMouseOver={(e) => handleHoverMarker(e, item)}
            onClick={(e) => handleClickMarker(e, item)}
            anchor={[Number(latitude), Number(longitude)]}
            offset={[-15, -15]}
            style={{ zIndex: 10 }}
          >
            <div
              style={{
                borderColor: item.status ? (item.status.edge_status === EdgeStatusEnum.Online ? svgVariables.$green : svgVariables.$yellow) : svgVariables.$red,
              }}
              className={classes.markerIcon}
            ></div>
          </Marker>
        )
      })}
      <div className={classes.edgeStatus}>
        <div className={classes.statusBox}>
          <span className={classes.edgeCount}>{edges.length}</span>
          <div className={classes.title}>Edges</div>
        </div>
        <div className={classes.statusBox}>
          <div className={classes.green}>
            <Badge status={'processing'} /> <span>{edges.filter((edge) => edge.status && edge.status.edge_status === EdgeStatusEnum.Online).length || 0}</span>
            <span className={classes.name}>Online</span>
          </div>
          <div className={classes.yellow}>
            <Badge status={'warning'} /> <span>{edges.filter((edge) => edge.status && edge.status.edge_status === EdgeStatusEnum.Degraded).length || 0}</span>
            <span className={classes.name}>Degraded</span>
          </div>
          <div className={classes.red}>
            <Badge status={'error'} /> <span>{edges.filter((edge) => !edge.status).length || 0}</span> <span className={classes.name}>Offline</span>
          </div>
        </div>
      </div>
    </Map>
  ) : null

  return (
    <div className={cn('fade', classes.map, { [classes.isNotMap]: !isMap })}>
      {/* <YMaps>{placemarks}
      </YMaps> */}
      {map}
      {tooltip.hovered && <Hover title={tooltip.data?.title} state={tooltip} />}
      {tooltip.clicked && <Tooltip state={tooltip} setVisible={setTooltip} />}
    </div>
  )
}

export default Maps
