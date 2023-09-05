import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useAppSelector } from 'store/hooks'
import { WsStatusTypes } from 'types'

type Props = {
  params: any
  message: any
}

const useGetStatusWs = ({ params, message }: Props) => {
  const [status, setStatus] = useState<WsStatusTypes>()
  const {
    navigation: { currentEdge },
  } = useAppSelector((state) => state)

  const privateIpURL = `ws://${currentEdge?.private_ip}:8080/api/v1/device?params=${JSON.stringify(params)}`
  const publicIpURL = `ws://${currentEdge?.public_ip}:8080/api/v1/device?params=${JSON.stringify(params)}`

  const [url, setUrl] = useState<string>(privateIpURL)
  const [pingInterval, setPingInterval] = useState<number>(40)
  const [isPinging, setIsPinging] = useState<boolean>(false)

  const { lastJsonMessage, sendMessage, readyState, getWebSocket } = useWebSocket(url, {
    onError: (event) => {
      console.error('WebSocket connection error:', event)
    },
  })

  useEffect(() => {
    let intervalValue: NodeJS.Timeout

    const fetchData = () => {
      if (readyState === ReadyState.OPEN) {
        sendMessage(JSON.stringify(message))
        setStatus(lastJsonMessage as WsStatusTypes)
      }
    }

    const connectPrivateWebSocket = () => {
      if (readyState === ReadyState.CONNECTING && url !== privateIpURL) {
        setUrl(privateIpURL)
        setPingInterval(40)
        setIsPinging(false)
      }
    }

    const reconnectWebSocket = () => {
      if (readyState === ReadyState.CLOSED) {
        setUrl(publicIpURL)
        setPingInterval(5000)
        setIsPinging(true)
      }
    }

    const pingWebSocket = () => {
      if (isPinging) {
        clearInterval(intervalValue)
        intervalValue = setInterval(connectPrivateWebSocket, 2000)
      }
    }

    intervalValue = setInterval(fetchData, pingInterval)
    reconnectWebSocket()
    pingWebSocket()

    return () => {
      clearInterval(intervalValue)
    }
  }, [
    currentEdge,
    readyState,
    lastJsonMessage,
    sendMessage,
    message,
    url,
    privateIpURL,
    publicIpURL,
    pingInterval,
    isPinging,
  ])

  return {
    status: status?.type,
    description: status?.description,
    frame: status?.extra_field ? JSON.parse(status?.extra_field) : null,
  }
}

export default useGetStatusWs
