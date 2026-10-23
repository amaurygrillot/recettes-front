import { classNames } from '../../lib/classNames'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger' | 'danger-outline'
export type ButtonSize = 'large' | 'medium'

// Secondary and quiet buttons stay transparent when disabled, so they cannot use `disabled-look`.
const DISABLED_TRANSPARENT = 'disabled:cursor-not-allowed disabled:text-disabled-text'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'disabled-look border-ink-900 bg-butter-300 text-ink-900 shadow-stamp focus-visible:outline-offset-4 enabled:hover:bg-butter-400 enabled:active:translate-1 enabled:active:bg-mustard-500 enabled:active:shadow-none',
  secondary: `${DISABLED_TRANSPARENT} border-ink-900 bg-paper-50 text-ink-900 focus-visible:outline-offset-4 enabled:hover:bg-butter-100 enabled:active:translate-0.5 enabled:active:bg-butter-200 disabled:border-dashed disabled:border-disabled-border disabled:bg-transparent`,
  quiet: `${DISABLED_TRANSPARENT} link-underline border-transparent bg-transparent text-ink-900 focus-visible:outline-offset-2 enabled:hover:bg-paper-200 enabled:active:bg-paper-300 disabled:no-underline`,
  // Brick text on paper: a destructive action that is not yet the one being confirmed.
  'danger-outline': `${DISABLED_TRANSPARENT} border-ink-900 bg-paper-50 text-brick focus-visible:outline-offset-4 enabled:hover:bg-brick-bg enabled:active:translate-0.5 enabled:active:bg-brick-bg disabled:border-dashed disabled:border-disabled-border disabled:bg-transparent`,
  danger:
    'disabled-look border-ink-900 bg-brick text-paper-50 shadow-stamp focus-visible:outline-offset-4 enabled:active:translate-1 enabled:active:shadow-none',
}

const SIZES: Record<ButtonSize, string> = {
  large: 'min-h-16 text-label',
  medium: 'min-h-14 text-body',
}

// Waiting for an answer looks the same whatever the button was: it keeps its place and size, and
// the pale butter says « working » without the dashed look of a disabled button.
const BUSY =
  'cursor-progress border-ink-900 bg-butter-100 text-ink-900 focus-visible:outline-offset-4'

interface ButtonLook {
  variant: ButtonVariant
  size: ButtonSize
  fullWidth: boolean
  busy?: boolean
}

/** The one definition of how a button looks, shared by the `<button>` and by the link that looks like one. */
export function buttonClassName({ variant, size, fullWidth, busy = false }: ButtonLook): string {
  return classNames(
    'inline-flex items-center justify-center gap-2.5 rounded-l border-2 px-6 text-center font-bold',
    !busy && 'cursor-pointer',
    busy ? BUSY : VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
  )
}
