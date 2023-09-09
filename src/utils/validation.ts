import { ChangeEvent } from 'react'

export function calculateTotalAmount(amount: number, discountPercentage: number | null): number {
  if (discountPercentage === null) {
    return amount
  }

  const discountAmount = (amount * discountPercentage) / 100
  const totalAmount = amount - discountAmount
  return totalAmount
}

export function onKeyDownValidation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (!/[0-9]/.test(event.key) && event.key !== 'Delete' && event.key !== 'Backspace') {
    event.preventDefault()
  }
}
export function isCurrentPath(paths: string[]): boolean {
  const currentPage = window.location.pathname.trim().slice(1)
  return paths.some((path) => currentPage === path.trim())
}

export function replaceProtocolToWs(ip: string | undefined): string {
  if (ip?.includes('http')) {
    return ip?.replace('http', 'ws')
  } else if (ip?.includes('https')) {
    return ip?.replace('https', 'wss')
  }
  return typeof ip === 'string' ? ip : ''
}

function isValidHttpUrl(string: string) {
  try {
    const newUrl = new URL(string)
    if (['http:'].includes(newUrl.protocol)) {
      if (newUrl.port !== '') {
        const port = parseInt(newUrl.port)
        if (!isNaN(port) && port >= 1 && port <= 65535) {
          return true
        }
      } else if (!string.endsWith(':')) {
        return true
      }
    }
  } catch (error: any) {
    console.error('Error occurred during URL parsing:', error.message)
  }
  return false
}
function isValidHttpsUrl(string: string) {
  try {
    const newUrl = new URL(string)
    if (['https:'].includes(newUrl.protocol)) {
      if (newUrl.port !== '') {
        const port = parseInt(newUrl.port)
        if (!isNaN(port) && port >= 1 && port <= 65535) {
          return true
        }
      } else if (!string.endsWith(':')) {
        return true
      }
    }
  } catch (error: any) {
    console.error('Error occurred during URL parsing:', error.message)
  }
  return false
}

// export const validatePrivateIp = (_: any, value: string) => {
//   if (!value) {
//     return Promise.reject('Private IP is required')
//   }
//   if (!isValidHttpUrl(value)) {
//     return Promise.reject('Please enter a valid URL with the format: http://hostname:port')
//   }
//   return Promise.resolve()
// }

export const validateIp = (_: any, value: string) => {
  if (!value) {
    return Promise.reject('IP is required')
  }
  if (!isValidHttpUrl(value) && !isValidHttpsUrl(value)) {
    return Promise.reject('Please enter a valid URL with the format: http(s)://hostname:port')
  }
  return Promise.resolve()
}
// export const validateLatLon = (type: 'Latitude' | 'Longitude', _: any, value: string) => {
//   const regex = /^-?\d+\.\d+$/;
//   if (!value) {
//     return Promise.reject(`${type} is required`);
//   }
//   if (!regex.test(value)) {
//     return Promise.reject(`Please enter a valid ${type} with the float number format`);
//   }
//   return Promise.resolve();
// };

export const validatePaymentExpiryMinutes = (_: any, value: number) => {
  if (!value) {
    return Promise.resolve()
  }

  if (value < 0) {
    return Promise.reject('Payment expiry minutes must be greater than or equal to 0')
  }
  const maxValue = 24 * 60
  if (value > maxValue) {
    return Promise.reject(`Payment expiry minutes must be less than or equal to ${maxValue}`)
  }
  return Promise.resolve()
}

export const validateRegistrationTimeoutDays = (_: any, value: number) => {
  if (!value) {
    return Promise.resolve()
  }
  if (value < 1) {
    return Promise.reject('Minimum number of days is 1')
  }
  if (value > 365) {
    return Promise.reject('Maximum number of days is 365')
  }
  return Promise.resolve()
}

export const validateEmail = (_: any, value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!value) {
    return Promise.reject('Email is required')
  }

  if (!emailRegex.test(value) || value.endsWith('.')) {
    return Promise.reject('Please enter a valid email address')
  }
  return Promise.resolve()
}

export const validatePrice = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve()
  }
  const priceRegex = /^\d+$/

  if (!priceRegex.test(value)) {
    return Promise.reject('Please enter a valid unsigned integer')
  }

  return Promise.resolve()
}

export const validateMinutes = (_: any, value: string) => {
  const MINUTES_IN_AN_HOUR = 60
  const HOURS_IN_A_DAY = 24
  const DAYS_IN_A_YEAR = 365
  const MINUTES_IN_A_YEAR = MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY * DAYS_IN_A_YEAR

  const minutesRegex = /^\d+$/

  if (!value) {
    return Promise.resolve()
  }

  if (!minutesRegex.test(value)) {
    return Promise.reject('Please enter a valid unsigned integer')
  }
  const minutes = parseInt(value, 10)

  if (minutes > MINUTES_IN_A_YEAR) {
    return Promise.reject(`Maximum value is ${MINUTES_IN_A_YEAR} (1 year in minutes)`)
  }
  return Promise.resolve()
}

export const validateFps = (_: any, value: any) => {
  if (!value) {
    return Promise.resolve()
  }
  const fps = Number(value)

  if (!isNaN(fps) && fps >= 0 && fps <= 1000) {
    return Promise.resolve()
  }
  return Promise.reject('Please enter a valid number between 0 and 1 000')
}

export const validateBufferSize = (_: any, value: any) => {
  if (!value) {
    return Promise.resolve()
  }
  const bufferSize = Number(value)

  if (!isNaN(bufferSize) && bufferSize >= 0 && bufferSize <= 100) {
    return Promise.resolve()
  }

  return Promise.reject('Please enter a valid number between 0 and 100')
}

export const validateFrameHW = (_: any, value: any) => {
  if (!value) {
    return Promise.resolve()
  }
  const frameHW = Number(value)

  if (!isNaN(frameHW) && frameHW >= 0 && frameHW <= 10000) {
    return Promise.resolve()
  }

  return Promise.reject('Please enter a valid number between 0 and 10 000')
}

export const validateDetectionIterationIncrease = (_: any, value: any) => {
  if (!value) {
    return Promise.resolve()
  }
  const threshold = Number(value)

  if (!isNaN(threshold) && threshold >= 0 && threshold <= 2) {
    const isPercentageWithDecimal = /^\d+(\.\d{1,2})?$/.test(value)
    if (isPercentageWithDecimal) {
      return Promise.resolve()
    }
  }

  return Promise.reject('Please enter a valid number between 0.00 and 2')
}

export const floatPercentage = (_: any, value: any) => {
  if (!value) {
    return Promise.resolve()
  }
  const threshold = Number(value)
  if (!isNaN(threshold) && threshold >= 0 && threshold <= 100) {
    const isPercentageWithDecimal = /^\d+(\.\d{1,2})?$/.test(value)
    if (isPercentageWithDecimal) {
      return Promise.resolve()
    }
  }

  return Promise.reject('Please enter a valid percentage between 0.00 and 100')
}
export const validateMinFontSize = (_: any, value: any) => {
  const regex = /^(?:100|[1-9]\d|\d)$/
  if (!value) {
    return Promise.resolve()
  }

  if (!regex.test(value)) {
    return Promise.reject('Please enter a valid integer between 0 and 100')
  }

  return Promise.resolve()
}

export const validateWH = (_: any, value: any) => {
  if (!value) {
    return Promise.resolve() // Treat empty value as valid
  }

  const numericValue = Number(value)

  if (isNaN(numericValue) || !Number.isInteger(numericValue) || numericValue < 0 || numericValue > 10000) {
    return Promise.reject('Please enter a valid integer between 0 and 10 000.')
  }

  if (numericValue % 8 === 0) {
    return Promise.resolve() // Valid
  } else {
    return Promise.reject('Width must be a multiple of 8.')
  }
}

export function prettifiedMinutes(num: number | undefined | null): string {
  if (num) {
    return `${Math.floor(num / 60)}:${num % 60}`
  } else {
    return '0:0'
  }
}

export function toUpperCase(e: ChangeEvent<HTMLInputElement>): void {
  const value = e.target.value.toUpperCase()
  e.target.value = value
}

export function logOut() {
  localStorage.removeItem('profile')
  localStorage.removeItem('edge')
  window.location.href = '/login'
}
