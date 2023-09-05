import { ComponentType, useEffect, useState } from 'react'
import { NoInternet } from 'components'

type Status = 'online' | 'offline'
const withInternetStatus = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
  return (props: P) => {
    const [internetStatus, setInternetStatus] = useState<Status>(() => {
      const storedStatus = sessionStorage.getItem('internetStatus')
      return storedStatus ? (storedStatus as Status) : 'online'
    })

    useEffect(() => {
      const handleOnline = () => {
        setInternetStatus('online')
        sessionStorage.setItem('internetStatus', 'online')
      }
      const handleOffline = () => {
        setInternetStatus('offline')
        sessionStorage.setItem('internetStatus', 'offline')
      }

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }, [])

    if (internetStatus == 'offline') {
      return <NoInternet />
    }
    return <WrappedComponent {...props} />
  }
}

export default withInternetStatus
