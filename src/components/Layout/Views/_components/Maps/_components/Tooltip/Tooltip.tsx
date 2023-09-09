import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { IEdgeDTO } from 'types'
import classes from './Tooltip.module.scss'
import { Badge, Col, Grid, Row, Typography } from 'antd'
import { ExternalLink, X } from 'tabler-icons-react'
import { useAppDispatch } from 'store/hooks'
import { useClickAway, useLocalStorage } from 'react-use'
import { setCurrentEdge } from 'store/slices/navigation'

type Props = {
  state: { clicked: boolean; hovered: boolean; x: number; y: number; data: IEdgeDTO | null }
  setVisible: Function
}

const Tooltip: FC<Props> = ({ state, setVisible }) => {
  const [_, setLocalEdges] = useLocalStorage('edge')
  const [position, setPositiob] = useState({ x: state.x + 10, y: state.y - 20 })
  const dispatch = useAppDispatch()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()

  const ref = useRef(null)
  useClickAway(ref, () => {
    setVisible(false)
  })

  const handleClickEdge = () => {
    setLocalEdges(state.data)
    dispatch(setCurrentEdge(state.data))
  }

  useEffect(() => {
    if (xs) {
      setPositiob({ x: state.x - state.x / 2, y: state.y + 15 })
    }
  }, [xs])

  return (
    <div ref={ref} className={classes.tooltip} onClick={handleClickEdge} style={{ left: position.x, top: position.y }}>
      <header>
        <Typography.Text className={classes.title} ellipsis={true}>
          {state.data?.title}
        </Typography.Text>
        <ExternalLink />
      </header>
      <main className={classes.statusBox}>
        <div>
          <div className={classes.devices}>
            {(state.data?.status?.online_devices || 0) + (state.data?.status?.degraded_devices || 0) + (state.data?.status?.offline_devices || 0)}
          </div>
          <div className={classes.title}>Devices</div>
        </div>
        <div>
          <div className={classes.green}>
            <Badge status={'processing'} /> <span>{state.data?.status?.online_devices || 0}</span> <span className={classes.name}>Online</span>{' '}
          </div>
          <div className={classes.yellow}>
            <Badge status={'warning'} /> <span>{state.data?.status?.degraded_devices || 0}</span> <span className={classes.name}>Degraded</span>{' '}
          </div>
          <div className={classes.red}>
            <Badge status={'error'} /> <span>{state.data?.status?.offline_devices || 0}</span> <span className={classes.name}>Offline</span>{' '}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Tooltip
