import type { ComponentProps } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import type { IconName } from '../../../../components/Icon/iconShapes'
import { classNames } from '../../../../lib/classNames'

export type GestureButtonProps = Omit<
  ComponentProps<'button'>,
  'className' | 'children' | 'aria-label' | 'type'
> & {
  /** What it does, since it has no text: « Monter l'étape 2 ». */
  label: string
  icon: IconName
  /** 44 px for the buttons of a tile or a line, 48 px for those of a group. */
  size?: 'regular' | 'large'
  /** `brick` for what takes something away. */
  tone?: 'ink' | 'brick'
}

const SIZES = {
  regular: { frame: 'size-11', icon: 22 },
  large: { frame: 'size-12', icon: 24 },
} as const

/**
 * The small square buttons that move or remove an item of the editor (up, down, left, right, the
 * bin): outlined in ink, dashed and dimmed when they lead nowhere (the first item cannot go up).
 */
export function GestureButton({
  label,
  icon,
  size = 'regular',
  tone = 'ink',
  ...rest
}: GestureButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={classNames(
        'inline-grid shrink-0 cursor-pointer place-items-center rounded-m border-2 border-ink-900 bg-paper-50 enabled:active:bg-butter-200 disabled:cursor-not-allowed disabled:border-dashed disabled:border-disabled-border disabled:bg-disabled-bg disabled:text-disabled-text',
        SIZES[size].frame,
        tone === 'brick' ? 'text-brick' : 'text-ink-900',
      )}
      {...rest}
    >
      <Icon name={icon} size={SIZES[size].icon} strokeWidth={2.6} />
    </button>
  )
}
