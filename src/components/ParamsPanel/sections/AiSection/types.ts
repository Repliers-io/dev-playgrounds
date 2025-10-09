export interface ImageSearchItem {
  type: 'text' | 'image'
  value?: string
  url?: string
  boost: number
}

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
