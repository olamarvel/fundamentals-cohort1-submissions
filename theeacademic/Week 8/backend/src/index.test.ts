import { describe, it, expect } from 'vitest'

describe('Basic smoke tests', () => {
  it('should pass a trivial test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should verify environment is working', () => {
    expect(process.env.NODE_ENV).toBeDefined()
  })
})
