import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { IAccessDTO } from 'types'

type Props = {
  device_ids: number[]
  verified_only: boolean
  skip_image: boolean
}

const useGetAccessWs = ({ device_ids, verified_only, skip_image }: Props) => {
  const [accessDataWs, setAccessDataWs] = useState<IAccessDTO[]>([])
  const [retryCount, setRetryCount] = useState(0)

  const { lastJsonMessage, readyState } = useWebSocket(
    `ws://192.168.24.184:8080/api/v1/access?device_ids=${JSON.stringify(
      device_ids,
    )}&verified_only=${verified_only}&skip_image=${skip_image}`,
    {
      onError: (event) => {
        console.error('WebSocket connection error:', event)
      },
      onReconnectStop: () => {
        setRetryCount((prevCount) => prevCount + 1)
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1)
        }, 2000)
      },
    },
  )
  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastJsonMessage) {
      setAccessDataWs((prevItems) => {
        const updatedItems = [
          lastJsonMessage as IAccessDTO | any,
          ...prevItems.filter((item) => item.id !== (lastJsonMessage as IAccessDTO | any).id),
        ]
        if (updatedItems.length > 15) {
          updatedItems.length = 15
        }
        return updatedItems
      })
    }
  }, [readyState, lastJsonMessage])

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      setRetryCount((prevCount) => prevCount + 1)
    }
  }, [readyState, setRetryCount])

  useEffect(() => {
    if (retryCount > 0) {
      // Reconnect WebSocket
      const reconnectTimeout = setTimeout(() => {
        setRetryCount((prevCount) => prevCount - 1)
      }, 2000)

      return () => {
        clearTimeout(reconnectTimeout)
      }
    }
  }, [retryCount, setRetryCount])

  return { data: accessDataWs }
}

export default useGetAccessWs
