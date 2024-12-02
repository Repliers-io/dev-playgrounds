import { multiplySqft, parseSqftString } from './numbers'

describe('utils/numbers', () => {
  it('should correctly parse a sqft string', () => {
    expect(parseSqftString('10\'5"')).toBe(125)
    expect(parseSqftString('0\'12"')).toBe(12)
  })

  it('should return 0 for invalid format', () => {
    expect(parseSqftString('invalid')).toBe(0)
  })

  it('should correctly multiply two sqft strings', () => {
    const result = multiplySqft('10\'5"', '2\'2"')
    expect(result).toEqual({
      inches: 3250,
      feet: 22,
      remainingInches: 82,
      string: '22′82″'
    })
  })
})
