import { classNames } from '../../lib/classNames'
import { COCOTTE_COMPACT, COCOTTE_ICON } from './cocotteShapes'
import { LARGE_SHAPE, LOCKUP_SHAPE } from './logoShapes'
import { strings } from './strings'

export type LogoVariant = 'large' | 'lockup' | 'mark'
/** `color` on paper, `on-butter` on a yellow background, `mono` for one ink colour. */
export type LogoTone = 'color' | 'on-butter' | 'mono'

export interface LogoProps {
  /** `large` with the name under the cocotte, `lockup` with it on the right, `mark` without a name (below 40 px: the icon's simpler drawing). */
  variant: LogoVariant
  tone?: LogoTone
  /** Rendered height in px: the width follows the shape of the variant. */
  size: number
  /** Hide it from assistive technology when the name is already given next to it (a labelled link). */
  decorative?: boolean
}

// What changes with the tone is painted through CSS variables; ink is always ink-900, brick is brick but for the one-colour tone.
const INK = '[--logo-ink:var(--color-ink-900)]'
const TONES: Record<LogoTone, string> = {
  color: `${INK} [--logo-gold:var(--color-butter-300)] [--logo-gold-deep:var(--color-butter-400)] [--logo-cream:var(--color-paper-50)] [--logo-blush:var(--color-brick-bg)] [--logo-brick:var(--color-brick)]`,
  'on-butter': `${INK} [--logo-gold:var(--color-paper-50)] [--logo-gold-deep:var(--color-butter-200)] [--logo-cream:var(--color-paper-50)] [--logo-blush:var(--color-brick-bg)] [--logo-brick:var(--color-brick)]`,
  mono: `${INK} [--logo-gold:var(--color-paper-50)] [--logo-gold-deep:var(--color-paper-50)] [--logo-cream:var(--color-paper-50)] [--logo-blush:var(--color-paper-50)] [--logo-brick:var(--color-ink-900)]`,
}

const VIEW_BOXES: Record<LogoVariant, { x: number; width: number; height: number }> = {
  large: { x: -19, width: 238, height: 234 },
  lockup: { x: 0, width: 1229, height: 200 },
  mark: { x: 0, width: 200, height: 200 },
}

// Below this height the compact mark loses its steam and its lid band, which would only become a smudge.
const COMPACT_FROM = 40

function shapeOf(variant: LogoVariant, size: number) {
  if (variant === 'large') return LARGE_SHAPE
  if (variant === 'lockup') return LOCKUP_SHAPE
  return size >= COMPACT_FROM ? COCOTTE_COMPACT : COCOTTE_ICON
}

export function Logo({ variant, tone = 'color', size, decorative = false }: LogoProps) {
  const { x, width, height } = VIEW_BOXES[variant]

  return (
    <svg
      viewBox={`${x} 0 ${width} ${height}`}
      width={(size * width) / height}
      height={size}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : strings.name}
      aria-hidden={decorative ? 'true' : undefined}
      className={classNames('shrink-0', TONES[tone])}
    >
      {shapeOf(variant, size)}
    </svg>
  )
}
