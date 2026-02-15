import { describe, it, expect } from 'vitest'
import { left, right, isLeft, isRight, fold, map, flatMap } from '../either'

describe('Either', () => {
  describe('left', () => {
    it('creates a Left value', () => {
      const result = left('error')
      expect(result._tag).toBe('Left')
      expect(result.value).toBe('error')
    })
  })

  describe('right', () => {
    it('creates a Right value', () => {
      const result = right(42)
      expect(result._tag).toBe('Right')
      expect(result.value).toBe(42)
    })
  })

  describe('isLeft', () => {
    it('returns true for Left', () => {
      expect(isLeft(left('error'))).toBe(true)
    })

    it('returns false for Right', () => {
      expect(isLeft(right(42))).toBe(false)
    })
  })

  describe('isRight', () => {
    it('returns true for Right', () => {
      expect(isRight(right(42))).toBe(true)
    })

    it('returns false for Left', () => {
      expect(isRight(left('error'))).toBe(false)
    })
  })

  describe('fold', () => {
    it('calls onLeft for Left values', () => {
      const result = fold(
        left('error'),
        (e) => `Error: ${e}`,
        (a) => `Value: ${a}`
      )
      expect(result).toBe('Error: error')
    })

    it('calls onRight for Right values', () => {
      const result = fold(
        right(42),
        (e) => `Error: ${e}`,
        (a) => `Value: ${a}`
      )
      expect(result).toBe('Value: 42')
    })
  })

  describe('map', () => {
    it('transforms Right values', () => {
      const result = map(right(2), (x) => x * 3)
      expect(isRight(result) && result.value).toBe(6)
    })

    it('passes through Left values', () => {
      const result = map(left('error') as ReturnType<typeof left>, (x: number) => x * 3)
      expect(isLeft(result) && result.value).toBe('error')
    })
  })

  describe('flatMap', () => {
    it('chains Right values', () => {
      const result = flatMap(right(2), (x) =>
        x > 0 ? right(x * 3) : left('negative')
      )
      expect(isRight(result) && result.value).toBe(6)
    })

    it('passes through Left values', () => {
      const result = flatMap(
        left('error') as ReturnType<typeof left>,
        (x: number) => right(x * 3)
      )
      expect(isLeft(result) && result.value).toBe('error')
    })

    it('can produce Left from Right', () => {
      const result = flatMap(right(-1), (x) =>
        x > 0 ? right(x * 3) : left('negative')
      )
      expect(isLeft(result) && result.value).toBe('negative')
    })
  })
})
