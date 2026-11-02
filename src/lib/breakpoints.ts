/** The media queries behind the theme's breakpoints, for the few places that choose a component by screen width. */

/** From a tablet: wider margins, labelled buttons (`--breakpoint-tablet` in the theme). */
export const TABLET_QUERY = '(min-width: 600px)'

/** From a desktop: the bar at the top and the wide layouts (`--breakpoint-desktop`). */
export const DESKTOP_QUERY = '(min-width: 1024px)'

/** From a phone that is not a small one: the name fits beside the logo in the header. */
export const NAMED_LOGO_QUERY = '(min-width: 360px)'
