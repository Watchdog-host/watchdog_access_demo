import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from 'react-use'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useAppSelector } from 'store/hooks'
import { DEVICE_TYPE, IProfileDTO, WsStatusTypes } from 'types'
import { replaceProtocolToWs } from 'utils'

type Props = {
  type: DEVICE_TYPE
  data: any
}
const useGetStatusWs = ({ data, type }: Props) => {
  const [status, setStatus] = useState<WsStatusTypes>()
  const startTime = useRef(0)
  const responseTimeout = useRef(0)
  const width = useRef(data.message.width)
  const isfirstRender = useRef(true)
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const privateSocketUrl = `${replaceProtocolToWs(currentEdge?.private_ip)}/api/v1/device?token="${localProfile?.token}"&params=${JSON.stringify(data.params)}`
  const publicSocketUrl = `${replaceProtocolToWs(currentEdge?.public_ip)}/api/v1/device?token="${localProfile?.token}"&params=${JSON.stringify(data.params)}`
  const [socketUrl, setSocketUrl] = useState<string>('')

  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(socketUrl || privateSocketUrl, {
    onError: (event) => {
      console.error('WebSocket connection error:', event)
      setSocketUrl(publicSocketUrl)
    },
    retryOnError: true,
    shouldReconnect: () => true,
  })

  useEffect(() => {
    setStatus(lastJsonMessage as any)
    const endTime = Date.now()
    responseTimeout.current = endTime - startTime.current
  }, [lastJsonMessage])

  function calcMiddleWidth(pingInterval: number) {
    const MIN_WIDTH = data.message.width
    const MAX_WIDTH = 640

    if (responseTimeout.current < pingInterval) return width.current < MAX_WIDTH ? (width.current *= 2) : MAX_WIDTH
    else return width.current > MIN_WIDTH ? (width.current /= 2) : MIN_WIDTH
  }

  useEffect(() => {
    let intervalValue: NodeJS.Timeout
    let pingInterval = type === 'Camera' ? 1000 / 24 : 5000
    const fetchData = () => {
      if (readyState === ReadyState.OPEN) {
        startTime.current = Date.now()
        sendJsonMessage(data.message.width ? { ...data.message, width: calcMiddleWidth(pingInterval) } : data.message)
        isfirstRender.current = false
      }
    }
    if (isfirstRender.current) {
      fetchData()
    }

    intervalValue = setTimeout(fetchData, pingInterval)
    return () => {
      clearTimeout(intervalValue)
    }
  }, [readyState, lastJsonMessage])

  return {
    status,
  }
}

export default useGetStatusWs
