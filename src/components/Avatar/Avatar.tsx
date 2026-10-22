import { classNames } from '../../lib/classNames'
import { getInitials } from '../../lib/initials'
import { stableIndex } from '../../lib/stableIndex'
import { Icon } from '../Icon/Icon'
import { strings } from './strings'

export interface AvatarProps {
  /** Full name. Gives the initials and the accessible name; without it the avatar is anonymous. */
  name?: string
  /** 40 in lists, 56 as a button, 72 for a profile, 96 on the account page. */
  size?: number
}

// Six pairs, each readable (4.5:1 at least). The colour is picked from the name, never at random.
const PALETTES = [
  'bg-butter-300 text-ink-900',
  'bg-paper-200 text-ink-900',
  'bg-mustard-600 text-paper-50',
  'bg-brick text-paper-50',
  'bg-herb text-paper-50',
  'bg-ink-800 text-butter-300',
] as const

const BASE = 'inline-flex shrink-0 items-center justify-center rounded-full'
const LARGE_FROM = 96

export function Avatar({ name = '', size = 56 }: AvatarProps) {
  const fullName = name.trim()
  const initials = getInitials(fullName)

  if (!initials) {
    return (
      <span
        role="img"
        aria-label={strings.anonymous}
        style={{ width: size, height: size }}
        className={classNames(
          BASE,
          'border-2 border-dashed border-ink-500 bg-paper-50 text-ink-700',
        )}
      >
        <Icon name="user" size={size / 2} />
      </span>
    )
  }

  const palette = PALETTES[stableIndex(fullName.toLowerCase(), PALETTES.length)]

  return (
    <span
      role="img"
      aria-label={fullName}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={classNames(
        BASE,
        'border-ink-900 font-title font-extrabold',
        size >= LARGE_FROM ? 'border-3 shadow-stamp' : 'border-2',
        palette,
      )}
    >
      <span aria-hidden="true">{initials}</span>
    </span>
  )
}
