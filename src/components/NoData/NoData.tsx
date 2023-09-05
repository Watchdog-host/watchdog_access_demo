import { FC, ReactNode } from 'react'

import classes from './NoData.module.scss'
import { Empty } from 'antd'

type Props = {
  children?: ReactNode
}

const NoData: FC<Props> = () => {
  return (
    <div className={classes.wrapper}>
      <Empty />
    </div>
  )
}

export default NoData
