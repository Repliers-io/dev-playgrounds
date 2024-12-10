import { useEffect, useRef } from 'react'
const useDeepCompareEffect = (callback: () => void, dependencies: any[]) => {
  const currentDependenciesRef = useRef<string | null>(null)

  const dependenciesString = JSON.stringify(dependencies)

  if (currentDependenciesRef.current !== dependenciesString) {
    currentDependenciesRef.current = dependenciesString
  }

  useEffect(callback, [currentDependenciesRef.current])
}

export default useDeepCompareEffect
