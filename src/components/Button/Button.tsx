import React, { FC, ReactNode } from 'react'
import { Button as AntButton, ButtonProps } from 'antd'
import cn from 'classnames'

import './button.scss'

type Props = ButtonProps & {
  children?: ReactNode
  className?: string
  onlyIcon?: boolean
  fullWidth?: boolean
  bordered?: boolean
}

const Button: FC<Props> = ({ children, className, onlyIcon, fullWidth, ...props }) => {
  const classNames = cn(onlyIcon && 'button-onlyIcon', fullWidth && 'full-width', className && className)
  return (
    <AntButton className={classNames} {...props}>
      {children}
    </AntButton>
  )
}

export default Button
