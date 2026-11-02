import { DESKTOP_QUERY, TABLET_QUERY } from './breakpoints'
import { useMediaQuery } from './useMediaQuery'

/** The width of the screen as a closed set: a phone, a tablet (from 600 px) or a desktop (from 1024 px). */
export type LayoutKind = 'phone' | 'tablet' | 'desktop'

/** The layout the screen is in, kept up to date as it is resized or turned. */
export function useLayoutKind(): LayoutKind {
  const tabletOrMore = useMediaQuery(TABLET_QUERY)
  const desktop = useMediaQuery(DESKTOP_QUERY)
  if (desktop) return 'desktop'
  return tabletOrMore ? 'tablet' : 'phone'
}
