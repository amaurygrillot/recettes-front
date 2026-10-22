import type { ComponentProps, ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger'
type ButtonSize = 'large' | 'medium'

export type ButtonProps = Omit<ComponentProps<'button'>, 'className' | 'children'> & {
  /** The label, always: it is the accessible name. An icon-only button needs its own component with a required label. */
  children: ReactNode
  /** `primary`: one per screen. `secondary`: side actions. `quiet`: cancel, back. `danger`: only inside a confirmation dialog. */
  variant?: ButtonVariant
  /** `large` (64 px) by default; `medium` (56 px) is the floor, for toolbars and dialogs. */
  size?: ButtonSize
  icon?: IconName | undefined
  fullWidth?: boolean
}

// Secondary and quiet buttons stay transparent when disabled, so they cannot use `disabled-look`.
const DISABLED_TRANSPARENT = 'disabled:cursor-not-allowed disabled:text-disabled-text'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'disabled-look border-ink-900 bg-butter-300 text-ink-900 shadow-stamp focus-visible:outline-offset-4 enabled:hover:bg-butter-400 enabled:active:translate-1 enabled:active:bg-mustard-500 enabled:active:shadow-none',
  secondary: `${DISABLED_TRANSPARENT} border-ink-900 bg-paper-50 text-ink-900 focus-visible:outline-offset-4 enabled:hover:bg-butter-100 enabled:active:translate-0.5 enabled:active:bg-butter-200 disabled:border-dashed disabled:border-disabled-border disabled:bg-transparent`,
  quiet: `${DISABLED_TRANSPARENT} link-underline border-transparent bg-transparent text-ink-900 focus-visible:outline-offset-2 enabled:hover:bg-paper-200 enabled:active:bg-paper-300 disabled:no-underline`,
  danger:
    'disabled-look border-ink-900 bg-brick text-paper-50 shadow-stamp focus-visible:outline-offset-4 enabled:active:translate-1 enabled:active:shadow-none',
}

const SIZES: Record<ButtonSize, string> = {
  large: 'min-h-16 text-label',
  medium: 'min-h-14 text-body',
}

export function Button({
  variant = 'primary',
  size = 'large',
  icon,
  fullWidth = false,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-l border-2 px-6 text-center font-bold',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
      )}
      {...rest}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}
