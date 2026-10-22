import type { ReactElement } from 'react'
import { strings } from './strings'

/**
 * The drawings of the « Sceau et bol » logo, copied from the canvas symbols (`Logo-bol` board).
 * Ink is always ink-900; what changes with the tone (--stamp, --bowl, --rice, --band) is painted
 * through CSS variables that Logo sets, so one drawing serves every colourway.
 */

/** The mound of rice in its bowl: the compact mark, favicon and app icon (64 x 64). */
export const BOWL_SHAPE = (
  <>
    <path
      d="M12 36 C12 22 22 14 32 14 C42 14 52 22 52 36 Z"
      className="fill-(--rice) stroke-ink-900"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path
      d="M7 36 H57 C57 50 47 59 32 59 C17 59 7 50 7 36 Z"
      className="fill-(--bowl) stroke-ink-900"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path
      d="M13 45 C23 50 41 50 51 45"
      className="stroke-(--band)"
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
    />
  </>
)

/** The bowl with its chopsticks and a few grains of rice (64 x 64). */
export const FULL_BOWL_SHAPE = (
  <>
    <g className="stroke-ink-900" fill="none" strokeWidth={3.6} strokeLinecap="round">
      <path d="M58 5 L41 33" />
      <path d="M62 11 L47 34" />
    </g>
    {BOWL_SHAPE}
    <g className="fill-ink-900">
      <ellipse cx="27" cy="26" rx="2.6" ry="1.2" transform="rotate(-25 27 26)" />
      <ellipse cx="36" cy="22" rx="2.6" ry="1.2" transform="rotate(20 36 22)" />
      <ellipse cx="41" cy="29" rx="2.6" ry="1.2" transform="rotate(-10 41 29)" />
      <ellipse cx="22" cy="31" rx="2.6" ry="1.2" transform="rotate(15 22 31)" />
    </g>
  </>
)

/** The bowl and the name on one line (420 x 72). */
export const LOCKUP_SHAPE = (
  <>
    <g transform="translate(0 4)">{BOWL_SHAPE}</g>
    <text
      x="80"
      y="51"
      className="fill-ink-900 font-title"
      fontWeight={800}
      fontSize={38}
      textLength={336}
    >
      {strings.name}
    </text>
  </>
)

/** The round seal: the name in a crown around the full bowl (320 x 320). `arcId` makes the ids of its text paths unique. */
export function sealShape(arcId: string): ReactElement {
  return (
    <g transform="rotate(-3 160 160)">
      <defs>
        <path id={`${arcId}-top`} d="M62 160 A98 98 0 0 1 258 160" fill="none" />
        <path id={`${arcId}-bottom`} d="M32 160 A128 128 0 0 0 288 160" fill="none" />
      </defs>
      <circle cx="160" cy="160" r="150" className="fill-(--stamp) stroke-ink-900" strokeWidth={5} />
      <g className="stroke-ink-900" fill="none" strokeWidth={1.8}>
        <circle cx="160" cy="160" r="138" />
        <circle cx="160" cy="160" r="93" />
      </g>
      <g className="fill-ink-900 font-title" fontWeight={800} fontSize={34} letterSpacing={3}>
        <text>
          <textPath href={`#${arcId}-top`} startOffset="50%" textAnchor="middle">
            {strings.sealTop}
          </textPath>
        </text>
        <text>
          <textPath href={`#${arcId}-bottom`} startOffset="50%" textAnchor="middle">
            {strings.sealBottom}
          </textPath>
        </text>
      </g>
      <g className="fill-ink-900">
        <ellipse cx="46" cy="160" rx="4.5" ry="9" transform="rotate(-20 46 160)" />
        <ellipse cx="274" cy="160" rx="4.5" ry="9" transform="rotate(20 274 160)" />
      </g>
      <g transform="translate(94 80) scale(2.0625)">{FULL_BOWL_SHAPE}</g>
      <path
        d="M118 232 C132 224 144 238 160 231 S188 224 202 232"
        className="stroke-ink-900"
        fill="none"
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    </g>
  )
}
