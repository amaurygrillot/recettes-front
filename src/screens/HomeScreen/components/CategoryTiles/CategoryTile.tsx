import { Link } from 'react-router'
import { classNames } from '../../../../lib/classNames'
import { Icon } from '../../../../components/Icon/Icon'
import type { IconName } from '../../../../components/Icon/iconShapes'

export interface CategoryTileProps {
  to: string
  label: string
  icon: IconName
  /** The tile for what is being shown: yellow, with the stamp shadow. */
  current?: boolean
}

/** A shortcut of 92 × 88 px: an icon over a name. */
export function CategoryTile({ to, label, icon, current = false }: CategoryTileProps) {
  return (
    <Link
      to={to}
      aria-current={current ? 'true' : undefined}
      className={classNames(
        'flex h-22 w-23 shrink-0 flex-col items-center justify-center gap-1.5 rounded-frame border-2 border-ink-900 px-1 text-detail font-bold text-ink-900',
        current ? 'bg-butter-300 shadow-stamp-sm' : 'bg-paper-50 active:bg-butter-200',
      )}
    >
      <Icon name={icon} size={32} />
      <span className="max-w-full truncate">{label}</span>
    </Link>
  )
}
