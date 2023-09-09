import { FC } from 'react'
import { Input as AntInput, InputProps } from 'antd'
import cn from 'classnames'

import './Input.scss'

export type Props = InputProps & {
  isSearch?: boolean
  isPassword?: boolean
}

const Input: FC<Props> = ({ isSearch, prefix, isPassword, className, placeholder = 'Enter...', bordered = true, ...props }) => {
  const { Search, Password } = AntInput

  const classNames = cn(className)

  if (isSearch) {
    return <Search bordered={bordered} prefix={prefix} className={classNames} {...props} />
  } else if (isPassword) {
    return <Password bordered={bordered} prefix={prefix} className={classNames} {...props} />
  } else {
    return <AntInput bordered={bordered} prefix={prefix} className={classNames} placeholder={placeholder} size="small" {...props} />
  }
}

export default Input
