import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

export type StateBadgeTone = 'neutral' | 'success' | 'error'

export interface StateBadgeProps {
  tone: StateBadgeTone
  icon: IconName
}

const TONES: Record<StateBadgeTone, string> = {
  neutral: 'border-ink-900 bg-butter-200 text-ink-900',
  success: 'border-herb bg-herb-bg text-herb',
  error: 'border-brick bg-brick-bg text-brick',
}

/**
 * The 80 px round badge above the title of a screen that is only a message (« Regarde ta boîte
 * mail », « Mot de passe modifié », « Ce lien n'est plus valable »). Decorative: the title says it.
 */
export function StateBadge({ tone, icon }: StateBadgeProps) {
  return (
    <div
      aria-hidden="true"
      className={classNames(
        'grid size-20 shrink-0 place-items-center self-center rounded-full border-3',
        TONES[tone],
      )}
    >
      <Icon name={icon} size={40} strokeWidth={2.4} />
    </div>
  )
}
