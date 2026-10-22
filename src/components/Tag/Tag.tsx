import type { ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

export type TagTone = 'butter' | 'herb' | 'brick' | 'paper'

export interface TagProps {
  tone?: TagTone
  icon?: IconName | undefined
  children: ReactNode
}

const TONES: Record<TagTone, string> = {
  butter: 'border-ink-900 bg-butter-200 text-ink-900',
  herb: 'border-herb bg-herb-bg text-herb',
  brick: 'border-brick bg-brick-bg text-brick',
  paper: 'border-ink-900 bg-paper-50 text-ink-900',
}

/** A read-only label. It is not a button: no hover, no focus. To filter, use FilterChip. */
export function Tag({ tone = 'butter', icon, children }: TagProps) {
  return (
    <span
      className={classNames(
        'inline-flex min-h-9 items-center gap-1.5 rounded-pill border-thin px-3.5 text-detail font-bold',
        TONES[tone],
        icon && 'pl-2.5',
      )}
    >
      {icon && <Icon name={icon} size={18} strokeWidth={2.4} />}
      {children}
    </span>
  )
}
