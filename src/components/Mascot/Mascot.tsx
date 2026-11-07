import { useId, type ReactElement } from 'react'
import { classNames } from '../../lib/classNames'
import { LOGO_TONES, type LogoTone } from '../Logo/logoTones'
import { ASLEEP, celebrating, DEJECTED, HAPPY, LOST, SMITTEN, SURPRISED } from './mascotShapes'

/** Contente, dépitée, coup de cœur, surprise, perdue, endormie, en fête. */
export type MascotMood =
  'happy' | 'dejected' | 'smitten' | 'surprised' | 'lost' | 'asleep' | 'celebrating'

/** Width in px: 240 and up for empty states and error pages, 160 for cards, 96 for messages and dialogs, 64 and under for stamps and avatars. */
export type MascotSize = 'xl' | 'large' | 'medium' | 'small'

export interface MascotProps {
  mood: MascotMood
  size: MascotSize
  /** `on-butter` on a yellow background, where her yellow body would melt into it. */
  tone?: LogoTone
}

/** What each mood draws; the party hat's clip path needs an id of its own, given by the mascot that draws it. */
const DRAWINGS: Record<MascotMood, (hatClipId: string) => ReactElement> = {
  happy: () => HAPPY,
  dejected: () => DEJECTED,
  smitten: () => SMITTEN,
  surprised: () => SURPRISED,
  lost: () => LOST,
  asleep: () => ASLEEP,
  celebrating,
}

const WIDTHS: Record<MascotSize, number> = { xl: 240, large: 160, medium: 96, small: 64 }

// The drawings are 200 x 220.
const HEIGHT_RATIO = 1.1

// The colours the drawings read that are not the logo's: the herb green, and the party hat and confetti.
const EXTRA_COLORS = [
  '[--logo-herb:var(--color-herb)]',
  '[--logo-party-1:var(--color-party-pink)]',
  '[--logo-party-2:var(--color-party-teal)]',
  '[--logo-party-3:var(--color-party-blue)]',
  '[--logo-party-4:var(--color-party-yellow)]',
  '[--logo-party-5:var(--color-party-orange)]',
  '[--logo-party-6:var(--color-party-violet)]',
].join(' ')

/**
 * Mijotine, the cocotte of the logo grown up: its lid, its steam and its face change with the mood. Always
 * decorative: the place that shows her also says in words what happened, so the mood is never the only signal.
 */
export function Mascot({ mood, size, tone = 'color' }: MascotProps) {
  const width = WIDTHS[size]
  const hatClipId = useId()

  return (
    <svg
      viewBox="0 0 200 220"
      width={width}
      height={width * HEIGHT_RATIO}
      aria-hidden="true"
      className={classNames('shrink-0', LOGO_TONES[tone], EXTRA_COLORS)}
    >
      {DRAWINGS[mood](hatClipId)}
    </svg>
  )
}
