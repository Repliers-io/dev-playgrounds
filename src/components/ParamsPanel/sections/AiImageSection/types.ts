export interface ImageSearchItem {
  id?: string
  type: 'text' | 'image'
  value?: string
  url?: string
  boost: number
}

export const qualitativeInsightValues = [
  'excellent',
  'above average',
  'average',
  'below average',
  'poor'
] as const

export const propertyInsightFeatures = [
  'bedroom',
  'bathroom',
  'livingRoom',
  'diningRoom',
  'kitchen',
  'frontOfStructure'
] as const

export const coverImageOptions = [
  'kitchen',
  'bathroom',
  'bedroom',
  'living room',
  'front of structure',
  'laundry',
  'entrance foyer',
  'dining room',
  'back of structure',
  'patio'
] as const
