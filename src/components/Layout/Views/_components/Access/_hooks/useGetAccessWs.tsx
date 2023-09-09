import { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useAppSelector } from 'store/hooks'
import { IAccessDTO, IProfileDTO } from 'types'
import { replaceProtocolToWs } from 'utils'

type Props = {
  device_ids: number[]
  verified_only: boolean
  skip_image: boolean
}

const useGetAccessWs = ({ device_ids, verified_only, skip_image }: Props) => {
  const [accessDataWs, setAccessDataWs] = useState<IAccessDTO[]>([])
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const privateSocketUrl = `${replaceProtocolToWs(currentEdge?.private_ip)}/api/v1/access?token="${localProfile?.token}"&device_ids=${JSON.stringify(
    device_ids,
  )}&verified_only=${verified_only}&skip_image=${skip_image}`
  const publicSocketUrl = `${replaceProtocolToWs(currentEdge?.public_ip)}/api/v1/access?token="${localProfile?.token}"&device_ids=${JSON.stringify(
    device_ids,
  )}&verified_only=${verified_only}&skip_image=${skip_image}`
  const [socketUrl, setSocketUrl] = useState<string>('')

  const { lastJsonMessage, readyState } = useWebSocket(device_ids.length ? socketUrl || privateSocketUrl : null, {
    onError: (event) => {
      console.error('WebSocket connection error:', event)
      setSocketUrl(publicSocketUrl)
    },
    retryOnError: true,
    shouldReconnect: () => true,
  })

  useEffect(() => {
    setAccessDataWs([])
  }, [currentEdge])

  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastJsonMessage) {
      setAccessDataWs((prevItems) => {
        const updatedItems = [lastJsonMessage as IAccessDTO | any, ...prevItems.filter((item) => item.id !== (lastJsonMessage as IAccessDTO | any).id)].slice(0, 15)
        return updatedItems
      })
    }
  }, [readyState, lastJsonMessage])

  return { data: accessDataWs }
}
export default useGetAccessWs
