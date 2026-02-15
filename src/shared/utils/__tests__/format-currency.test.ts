import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../format-currency'

describe('formatCurrency', () => {
  it('formats USD amounts', () => {
    expect(formatCurrency(29.99)).toBe('$29.99')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('supports custom currency', () => {
    expect(formatCurrency(29.99, 'EUR')).toContain('29.99')
  })
})
