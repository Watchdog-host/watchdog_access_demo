import { useLocation } from 'react-router-dom'

export const clearObject = (object: {}) => {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined && !Number.isNaN(value),
    ),
  ) as {}
}

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
