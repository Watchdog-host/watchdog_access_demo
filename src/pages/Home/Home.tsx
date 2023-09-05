import React, { FC, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import classes from './Home.module.scss'

type Props = {
  children?: ReactNode
}

const Home: FC<Props> = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/Camera', { replace: true })
  }, [])

  return <div>Home</div>
}

export default Home
