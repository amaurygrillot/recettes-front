import { COCOTTE_LARGE, COCOTTE_LOCKUP } from './cocotteShapes'
import { strings } from './strings'

/**
 * The logos that carry the name, in the units of the cocotte's own 200 x 200 box (`Retouche-2-cocotte`): the name is
 * Fraunces 800 at the size and place the board gives it. The board sets it in CSS pixels, where the font picks its
 * optical size (`opsz`) from the font size: inside a scaled SVG that size would be the unit's, so it is pinned to the
 * board's (36 under the large logo, 29 beside the lockup), and `textLength` pins the width Fraunces measures at
 * that size (297 px at 36, 241 px at 29) so a fallback font cannot make the logo overflow.
 */

/** The cocotte with its name under it, centred (238 x 240, from x = -19). */
export const LARGE_SHAPE = (
  <>
    {COCOTTE_LARGE}
    <text
      x="100"
      y="229.5"
      textAnchor="middle"
      className="fill-ink-900 font-title"
      fontWeight={800}
      fontSize={28.8}
      textLength={237.4}
      style={{ fontVariationSettings: "'opsz' 36" }}
    >
      {strings.name}
    </text>
  </>
)

/** The cocotte with its name on its right, one line (1229 x 200). */
export const LOCKUP_SHAPE = (
  <>
    {COCOTTE_LOCKUP}
    <text
      x="225"
      y="143.7"
      className="fill-ink-900 font-title"
      fontWeight={800}
      fontSize={120.8}
      textLength={1003.5}
      style={{ fontVariationSettings: "'opsz' 29" }}
    >
      {strings.name}
    </text>
  </>
)
