import React, { FC, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import classes from './Home.module.scss'
import { isCurrentPath } from 'utils'

type Props = {
  children?: ReactNode
}

const Home: FC<Props> = () => {
  const navigate = useNavigate()
  const isView = isCurrentPath(['Access', 'Map'])

  useEffect(() => {
    if (!isView) {
      navigate('/Camera', { replace: true })
    }
  }, [])
  return <div>Home</div>
}

export default Home
