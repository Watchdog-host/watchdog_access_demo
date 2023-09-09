import React, { memo, useEffect, useMemo } from 'react'

import classes from './Views.module.scss'
import cn from 'classnames'
import { isCurrentPath } from 'utils'
import { useLocation } from 'react-router-dom'
import Maps from './_components/Maps'
import Access from './_components/Access'
import { VIEW_TYPE } from 'types'
export interface IDataMap {
  latitude: number
  longitude: number
  title: string
  id: number
  onClick?: (e: any) => void
}

type Props = {
  view: VIEW_TYPE
  setView: (view: VIEW_TYPE) => void
}

const Views: React.FC<Props> = ({ view, setView }) => {
  const isMap = isCurrentPath(['Map'])
  const isAccess = isCurrentPath(['Access'])
  const { pathname } = useLocation()

  useEffect(() => {
    if (isMap || isAccess) {
      setView(pathname.slice(1) as VIEW_TYPE)
    }
  }, [pathname])

  const content = useMemo(
    () => ({
      Access: <Access />,
      Map: <Maps />,
    }),
    [pathname],
  )
  return <div className={cn(classes.wrapper, { [classes.isMap]: isMap })}>{content[view || 'Map']}</div>
}

export default memo(Views)
