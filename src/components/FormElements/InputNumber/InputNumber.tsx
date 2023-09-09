import { FC } from 'react'
import { InputNumber as InputNumberAnt, InputNumberProps } from 'antd'

export type Props = InputNumberProps & {
  max?: number
  precision?: number
  float?: boolean
}

const InputNumber: FC<Props> = ({ max, precision, float, ...props }) => {
  const hasPrecision = precision !== undefined
  const allowDot = float || hasPrecision

  const formatter = (value: number | string | undefined) => {
    if (max !== undefined && !isNaN(max)) {
      if (Number(value) > max) {
        return max.toString()
      }
    }
    return value !== undefined ? value.toString() : ''
  }

  return (
    <InputNumberAnt
      formatter={formatter}
      onKeyPress={(event) => {
        const inputElement = event.target as HTMLInputElement
        const inputVal = inputElement.value
        const key = event.key
        const dotAlreadyPresent = inputVal.includes('.')

        if (key === '.' && (!allowDot || dotAlreadyPresent)) {
          event.preventDefault()
          return
        }

        if (!/[0-9.]/.test(key)) {
          event.preventDefault()
          return
        }

        if (dotAlreadyPresent && key === '0' && !hasPrecision) {
          event.preventDefault()
          return
        }

        if (dotAlreadyPresent && /^[0-9]$/.test(key) && hasPrecision && inputVal.split('.')[1].length >= precision!) {
          event.preventDefault()
          return
        }

        const newValue = parseFloat(inputVal + key)

        if (max !== undefined && !isNaN(max) && hasPrecision && newValue > max) {
          event.preventDefault()
          return
        }
      }}
      precision={precision}
      // max={max}
      {...props}
    />
  )
}

export default InputNumber
