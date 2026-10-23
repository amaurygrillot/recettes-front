import type { ComponentProps, ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles'

export type { ButtonVariant } from './buttonStyles'

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
    <button type={type} className={buttonClassName({ variant, size, fullWidth })} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}
