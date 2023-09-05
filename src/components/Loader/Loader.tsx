import React, { FC, ReactNode } from 'react'
import { Spin, SpinProps } from 'antd'
import cn from 'classnames'

import classes from './Loader.module.scss'
import { Loader2 } from 'tabler-icons-react'

type Props = SpinProps & {
  className?: string
  loaderSize?: number
  children?: ReactNode
}

const Loader: FC<Props> = ({ className, loaderSize = 48, children, ...props }) => {
  const classNames = cn(classes.loaderWrapper, className && className)

  return (
    <Spin
      indicator={<Loader2 style={{ fontSize: loaderSize }} className="rotating" />}
      className={classNames}
      {...props}
    >
      {children}
    </Spin>
  )
}

export default Loader
