import type { ReactElement } from 'react'
import { classNames } from '../../lib/classNames'
import { LOGO_TONES } from '../Logo/logoTones'
import { ASLEEP, CELEBRATING, DEJECTED, HAPPY, LOST, SMITTEN, SURPRISED } from './mascotShapes'

/** Contente, dépitée, coup de cœur, surprise, perdue, endormie, en fête. */
export type MascotMood =
  'happy' | 'dejected' | 'smitten' | 'surprised' | 'lost' | 'asleep' | 'celebrating'

/** Width in px: 240 and up for empty states and error pages, 160 for cards, 96 for messages and dialogs, 64 and under for stamps and avatars. */
export type MascotSize = 'xl' | 'large' | 'medium' | 'small'

export interface MascotProps {
  mood: MascotMood
  size: MascotSize
}

const DRAWINGS: Record<MascotMood, ReactElement> = {
  happy: HAPPY,
  dejected: DEJECTED,
  smitten: SMITTEN,
  surprised: SURPRISED,
  lost: LOST,
  asleep: ASLEEP,
  celebrating: CELEBRATING,
}

const WIDTHS: Record<MascotSize, number> = { xl: 240, large: 160, medium: 96, small: 64 }

// The drawings are 200 x 220.
const HEIGHT_RATIO = 1.1

/**
 * Mijotine, the cocotte of the logo grown up: its lid, its steam and its face change with the mood. Always
 * decorative: the place that shows her also says in words what happened, so the mood is never the only signal.
 */
export function Mascot({ mood, size }: MascotProps) {
  const width = WIDTHS[size]

  return (
    <svg
      viewBox="0 0 200 220"
      width={width}
      height={width * HEIGHT_RATIO}
      aria-hidden="true"
      className={classNames('shrink-0', LOGO_TONES.color, '[--logo-herb:var(--color-herb)]')}
    >
      {DRAWINGS[mood]}
    </svg>
  )
}
