import { classNames } from '../../lib/classNames'
import { getInitials } from '../../lib/initials'
import { stableIndex } from '../../lib/stableIndex'
import { Icon } from '../Icon/Icon'
import { strings } from './strings'

export interface AvatarProps {
  /** Full name. Gives the initials and the accessible name; without it the avatar is anonymous. */
  name?: string | undefined
  /** 40 in lists, 56 as a button, 72 for a profile, 96 on the account page. */
  size?: number
  /** Hide it from assistive technology when the name is already given next to it (a link « Compte »). */
  decorative?: boolean
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

function accessibility(label: string, decorative: boolean) {
  return decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label }
}

export function Avatar({ name = '', size = 56, decorative = false }: AvatarProps) {
  const fullName = name.trim()
  const initials = getInitials(fullName)

  if (!initials) {
    return (
      <span
        {...accessibility(strings.anonymous, decorative)}
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
      {...accessibility(fullName, decorative)}
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
