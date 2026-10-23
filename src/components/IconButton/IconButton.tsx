import type { ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'
import { CountBadge } from '../CountBadge/CountBadge'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

export type IconButtonProps = Omit<
  ComponentProps<'button'>,
  'className' | 'children' | 'aria-label'
> & {
  /** What it does: the accessible name, since it has no text. */
  label: string
  icon: IconName
  /**
   * `outlined`: a 56 px button with an ink outline (« Filtres »). `active`: the same in yellow with
   * the stamp shadow, for a button whose option is on. `bare`: no frame, for a cross in a field or a sheet.
   * `round`: a cream disc, readable over any photo (the way back, the author's menu).
   */
  variant?: 'outlined' | 'active' | 'bare' | 'round'
  /** 56 px by default; 48 px inside a field. */
  size?: 'large' | 'medium'
  /** A count of what is active, drawn on the corner; say it in `label` too. Nothing at zero. */
  badge?: number
}

const VARIANTS = {
  outlined:
    'rounded-l border-2 border-ink-900 bg-paper-50 enabled:active:bg-butter-200 focus-visible:outline-offset-3',
  active:
    'rounded-l border-2 border-ink-900 bg-butter-300 shadow-stamp-sm enabled:active:bg-mustard-500 focus-visible:outline-offset-3',
  bare: 'rounded-m border-2 border-transparent enabled:hover:bg-paper-200 enabled:active:bg-paper-300',
  round:
    'rounded-full border-2 border-ink-900 bg-paper-50 shadow-paper enabled:active:bg-butter-200 focus-visible:outline-offset-3',
}

const SIZES = { large: 'size-14', medium: 'size-12' }

/** A button that is only an icon. It cannot be written without a label. */
export function IconButton({
  label,
  icon,
  variant = 'outlined',
  size = 'large',
  badge = 0,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={classNames(
        'relative inline-flex shrink-0 disabled-look cursor-pointer items-center justify-center text-ink-900',
        VARIANTS[variant],
        SIZES[size],
      )}
      {...rest}
    >
      <Icon name={icon} size={size === 'large' ? 26 : 24} />
      {badge > 0 && (
        <span className="absolute -top-2 -right-2">
          <CountBadge count={badge} />
        </span>
      )}
    </button>
  )
}
