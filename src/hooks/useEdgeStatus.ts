import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from 'store/hooks'
import { IEdgeStatus } from 'types'

const useEdgeStatus = () => {
  const [info, setInfoData] = useState<IEdgeStatus | undefined>(undefined)
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const url = useRef('')

  const fetchEdgeStatus = async () => {
    try {
      const response: Response = await Promise.race([
        fetch(url.current || `${currentEdge?.private_ip}/api/v1/edge/status`),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 5000)),
      ])
      if (response.ok) {
        const data = await response.json()
        setInfoData(data)
      }
    } catch (error) {
      url.current = `${currentEdge?.public_ip}/api/v1/edge/status`
      setInfoData(undefined)
    }
  }

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined
    if (currentEdge) {
      fetchEdgeStatus()
      intervalId = setInterval(fetchEdgeStatus, 5000)
    }
    return () => {
      url.current = ''
      clearInterval(intervalId)
    }
  }, [currentEdge])
  return info
}

export default useEdgeStatus
