import { useEffect, useState } from 'react'

/** The page is « at the top » up to here; below it, only the direction of travel counts. */
const TOP_ZONE_PX = 24
/** Smaller movements are a finger resting or a rubber-band bounce, not a decision to scroll. */
const MIN_TRAVEL_PX = 8

/**
 * Whether the reader is going down the page: true once they scroll down away from the top, false
 * again as soon as they scroll back up or return to the top. It lets a floating control give
 * way while reading and come back when they look for it.
 */
export function useScrolledDown(): boolean {
  const [scrolledDown, setScrolledDown] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const travel = y - lastY
      // `lastY` moves only when a direction is decided, so that many tiny steps add up to one.
      if (y <= TOP_ZONE_PX) {
        setScrolledDown(false)
        lastY = y
      } else if (travel >= MIN_TRAVEL_PX) {
        setScrolledDown(true)
        lastY = y
      } else if (travel <= -MIN_TRAVEL_PX) {
        setScrolledDown(false)
        lastY = y
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return scrolledDown
}
