import type { ComponentProps, ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'
import { Spinner } from '../Spinner/Spinner'
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
  /**
   * Waiting for an answer: a spinner replaces the icon and a click does nothing. Unlike `disabled`
   * the button stays focusable, so the keyboard user keeps their place. The caller words the wait
   * (« Chargement… ») in `children`.
   */
  busy?: boolean
}

export function Button({
  variant = 'primary',
  size = 'large',
  icon,
  fullWidth = false,
  busy = false,
  type = 'button',
  onClick,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, busy })}
      aria-busy={busy || undefined}
      aria-disabled={busy || undefined}
      onClick={(event) => {
        // Not `disabled`: that would drop the focus. A busy submit button must not submit either.
        if (busy) event.preventDefault()
        else onClick?.(event)
      }}
      {...rest}
    >
      {busy ? <Spinner /> : icon && <Icon name={icon} />}
      {children}
    </button>
  )
}
