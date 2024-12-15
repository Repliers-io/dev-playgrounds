import { createContext, useContext, useState } from 'react'
import type React from 'react'

import { type MapPosition } from 'services/Map/types'

type PositionContextType = {
  position: MapPosition | null
  setPosition: (position: MapPosition) => void
}

type PositionProviderProps = {
  children: React.ReactNode
}

const PositionContext = createContext<PositionContextType | undefined>(
  undefined
)

const PositionProvider: React.FC<PositionProviderProps> = ({ children }) => {
  const [position, setPosition] = useState<MapPosition | null>(null)
  return (
    <PositionContext.Provider value={{ position, setPosition }}>
      {children}
    </PositionContext.Provider>
  )
}

export default PositionProvider

export const usePosition = () => {
  const context = useContext(PositionContext)

  if (!context) {
    throw new Error('usePosition must be used within a PositionProvider')
  }

  return context
}
