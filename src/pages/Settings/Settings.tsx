import React, { FC, ReactNode } from 'react'

import classes from './Settings.module.scss'

type Props = {
  children?: ReactNode
}

const Settings: FC<Props> = () => {
  return <div className={`fade`}>Settings</div>
}

export default Settings
