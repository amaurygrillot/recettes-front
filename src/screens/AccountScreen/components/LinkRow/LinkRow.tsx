import { Link } from 'react-router'
import { Icon } from '../../../../components/Icon/Icon'
import type { IconName } from '../../../../components/Icon/iconShapes'

export interface LinkRowProps {
  to: string
  icon: IconName
  label: string
}

/** A 64 px row that goes somewhere else (« Mes recettes »): an icon, its words, a chevron. */
export function LinkRow({ to, icon, label }: LinkRowProps) {
  return (
    <Link
      to={to}
      className="flex min-h-16 items-center gap-3.5 rounded-l border-2 border-ink-900 bg-paper-50 py-2.5 pr-3 pl-4 text-ink-900 hover:bg-butter-100 focus-visible:outline-offset-3 active:bg-butter-200"
    >
      <Icon name={icon} size={28} strokeWidth={2.4} />
      <span className="min-w-0 flex-1 text-label font-bold">{label}</span>
      <Icon name="chevron-right" size={26} strokeWidth={2.4} />
    </Link>
  )
}
