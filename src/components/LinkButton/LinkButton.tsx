import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { buttonClassName, type ButtonSize, type ButtonVariant } from '../Button/buttonStyles'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

export interface LinkButtonProps {
  /** Where it goes. A control that goes somewhere is a link, even when it looks like a button. */
  to: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: IconName | undefined
  fullWidth?: boolean
}

/** A link drawn as a Button, for « Retour à l'accueil », « Créer un compte »: same look, same targets. */
export function LinkButton({
  to,
  variant = 'primary',
  size = 'large',
  icon,
  fullWidth = false,
  children,
}: LinkButtonProps) {
  return (
    <Link to={to} className={buttonClassName({ variant, size, fullWidth })}>
      {icon && <Icon name={icon} />}
      {children}
    </Link>
  )
}
