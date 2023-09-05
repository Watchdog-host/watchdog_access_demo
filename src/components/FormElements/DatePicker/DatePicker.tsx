import React, { FC } from 'react'
import { DatePicker as AntDatePicker, DatePickerProps as AntDatePickerProps } from 'antd'

import './DatePicker.scss'

export type DatePickerProps = AntDatePickerProps & {
  width?: string
  ref?: any
}

const DatePicker: FC<DatePickerProps> = ({ ref, width, ...props }) => {
  return <AntDatePicker ref={ref} format="DD MMMM YYYY" style={{ width: `${width ? width : '100%'}` }} {...props} />
}

export default DatePicker
