import { useId } from 'react'
import { classNames } from '../../lib/classNames'
import { BOWL_SHAPE, FULL_BOWL_SHAPE, LOCKUP_SHAPE, sealShape } from './logoShapes'
import { strings } from './strings'

export type LogoVariant = 'seal' | 'lockup' | 'bowl'
/** `color` on paper, `on-butter` on a yellow background, `mono` for one ink colour. */
export type LogoTone = 'color' | 'on-butter' | 'mono'

export interface LogoProps {
  /** `seal` from 160 px up, `lockup` (bowl and name) in the desktop bar, `bowl` below 160 px. */
  variant: LogoVariant
  tone?: LogoTone
  /** Rendered height in px: the width follows the shape of the variant. */
  size: number
  /** Hide it from assistive technology when the name is already given next to it (a labelled link). */
  decorative?: boolean
}

// What changes with the tone is painted through CSS variables; ink is always ink-900.
const SEAL_TONES: Record<LogoTone, string> = {
  color:
    '[--stamp:var(--color-butter-300)] [--bowl:var(--color-paper-50)] [--rice:var(--color-paper-50)] [--band:var(--color-brick)]',
  'on-butter':
    '[--stamp:var(--color-paper-50)] [--bowl:var(--color-butter-300)] [--rice:var(--color-paper-50)] [--band:var(--color-ink-900)]',
  mono: '[--stamp:none] [--bowl:none] [--rice:none] [--band:var(--color-ink-900)]',
}

// The lockup and the bowl share their colourways.
const MARK_TONES: Record<LogoTone, string> = {
  color:
    '[--bowl:var(--color-butter-300)] [--rice:var(--color-paper-50)] [--band:var(--color-ink-900)]',
  'on-butter':
    '[--bowl:var(--color-paper-50)] [--rice:var(--color-paper-50)] [--band:var(--color-ink-900)]',
  mono: '[--bowl:none] [--rice:none] [--band:var(--color-ink-900)]',
}

const TONES: Record<LogoVariant, Record<LogoTone, string>> = {
  seal: SEAL_TONES,
  lockup: MARK_TONES,
  bowl: MARK_TONES,
}

const VIEW_BOXES: Record<LogoVariant, { width: number; height: number }> = {
  seal: { width: 320, height: 320 },
  lockup: { width: 420, height: 72 },
  bowl: { width: 64, height: 64 },
}

// Below this height the bowl loses its chopsticks and grains, which would only become a smudge.
const FULL_BOWL_FROM = 40

export function Logo({ variant, tone = 'color', size, decorative = false }: LogoProps) {
  const arcId = useId()
  const { width, height } = VIEW_BOXES[variant]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={(size * width) / height}
      height={size}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : strings.name}
      aria-hidden={decorative ? 'true' : undefined}
      className={classNames('shrink-0', TONES[variant][tone])}
    >
      {variant === 'seal' && sealShape(arcId)}
      {variant === 'lockup' && LOCKUP_SHAPE}
      {variant === 'bowl' && (size >= FULL_BOWL_FROM ? FULL_BOWL_SHAPE : BOWL_SHAPE)}
    </svg>
  )
}
