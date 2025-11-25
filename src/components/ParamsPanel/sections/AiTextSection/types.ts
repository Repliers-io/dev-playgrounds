export interface TextSearchItem {
  id?: string
  value: string
}

export const modelOptions = ['small', 'large'] as const

export type ModelOption = (typeof modelOptions)[number]
