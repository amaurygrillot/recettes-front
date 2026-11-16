import { useEffect, useState, type RefObject } from 'react'

const CELL_PX = 56
const MIN_COLUMNS = 5
const MAX_COLUMNS = 7
const DEFAULT_COLUMNS = 6

/**
 * How many 56 px cells fit across what the picker is given: five on the narrowest phone (320 px),
 * six on a phone, seven from a tablet. Six until it is measured, which is the phone's.
 */
export function useColumns(ref: RefObject<HTMLElement | null>): number {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)

  useEffect(() => {
    const element = ref.current
    if (element === null) return undefined
    const measure = () => {
      const fit = Math.floor(element.clientWidth / CELL_PX)
      if (fit > 0) setColumns(Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, fit)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [ref])

  return columns
}
