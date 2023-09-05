import { ReactNode, useEffect, useState } from 'react'

import { DEVICE_STATUS_TYPE, DEVICE_TYPE } from 'types'
import { device_states } from 'constants/device'

type Props = {
  status: DEVICE_STATUS_TYPE
  type: DEVICE_TYPE
}

const useDeviceStatus = ({ type, status }: Props) => {
  const [icon, setIcon] = useState<ReactNode>(null)
  useEffect(() => {
    setIcon(device_states[type][status].icon)
  }, [type, status])
  return { icon }
}

export default useDeviceStatus
