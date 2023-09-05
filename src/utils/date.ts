import { durationType } from 'types'

export function monthsOrYearsToDays(type: durationType, duration: number): number {
  if (type === '1') {
    return duration * 30 // Assuming 1 month = 30 days
  } else if (type === '12') {
    return duration * 365 // Assuming 1 year = 365 days
  }

  return 0 // Return 0 for unsupported types
}
