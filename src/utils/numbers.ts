import { toSafeNumber } from './formatters'

// NOTE: https://poe.com/p/What-is-the-symbol-used-to-represent-inches-in-writing

export const parseSqftString = (sqft: string) => {
  const regex = /(\d+)['′’](\d+)["″”]?/
  const matches = String(sqft).match(regex)
  if (!matches) return 0

  const feet = toSafeNumber(matches[1])
  const inches = toSafeNumber(matches[2])

  return feet * 12 + inches // Convert to total inches
}

export const multiplySqft = (sqft1: string, sqft2: string) => {
  const sqft1Inches = parseSqftString(sqft1)
  const sqft2Inches = parseSqftString(sqft2)

  const inches = sqft1Inches * sqft2Inches

  // There are 144 square inches in a square foot
  const feet = Math.floor(inches / 144)
  const remainingInches = inches % 144

  return {
    feet,
    inches,
    remainingInches,
    string: `${feet}′${remainingInches}″`
  }
}

/**
 * @description calculate the area in acres (imperial)
 * @param length Feet
 * @param width Feet
 * @returns Acres
 */
export const calcAreaAcres = (length: number, width: number) =>
  ((length * width) / 43560).toFixed(4)
