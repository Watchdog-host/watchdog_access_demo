import React, { useEffect, useMemo, useState } from 'react'

import classes from './Views.module.scss'
import cn from 'classnames'
import { isCurrentPath } from 'utils'
import { useLocation } from 'react-router-dom'
import Map from './_components/Map'
import Access from './_components/Access'

export interface IDataMap {
  latitude: number
  longitude: number
  title: string
  id: number
  onClick?: (e: any) => void
}

type Props = {
  data: IDataMap[]
}

const Views: React.FC<Props> = ({ data }) => {
  const isMap = isCurrentPath(['Map'])
  const isAccess = isCurrentPath(['Access'])
  const [view, setView] = useState(localStorage.getItem('view') || 'Map')

  const { pathname } = useLocation()

  useEffect(() => {
    if (isMap || isAccess) {
      localStorage.setItem('view', pathname.slice(1))
      setView(pathname.slice(1))
    }
  }, [pathname])

  const content = useMemo(
    () => ({
      Access: <Access />,
      Map: <Map data={data} />,
    }),
    [pathname],
  )

  return <div className={cn(classes.wrapper, { [classes.isMap]: isMap })}>{content[view as 'Access' | 'Map']}</div>
}

export default Views
