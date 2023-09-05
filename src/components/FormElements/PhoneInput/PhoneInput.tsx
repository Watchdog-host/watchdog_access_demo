import React, { ChangeEvent, FC } from 'react'
import { MaskedInput } from 'antd-mask-input'

import flag from 'assets/icons/flag.png'

import classes from './PhoneInput.module.scss'

export type Props = {
  size?: `small` | `middle` | `large`
  style?: any
  onChange?: (event: ChangeEvent<HTMLInputElement>) => any
}

const Input: FC<Props> = ({ size, style, onChange, ...props }) => {
  return (
    <>
      <MaskedInput
        mask="+998 ## ###-##-##"
        placeholder="+998 _ _  _ _ _ - _ _ - _ _"
        size={size}
        style={style}
        prefix={flag}
        onChange={onChange}
        className={classes.input}
        {...props}
      />
    </>
  )
}

export default Input
