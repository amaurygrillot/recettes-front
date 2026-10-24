import type { ComponentProps } from 'react'
import { Icon } from '../../../../components/Icon/Icon'

export type GripButtonProps = Omit<
  ComponentProps<'button'>,
  'className' | 'children' | 'type' | 'aria-label'
> & {
  /** What it grips, for those who hear it: « Déplacer l’étape 2 ». */
  label: string
}

/**
 * The grip of an item that can be dragged: 44 px, bare until it is focused. It only starts a drag (the
 * pointer, or space and the arrows); `touch-none` keeps a finger on it from scrolling the page.
 */
export function GripButton({ label, ...rest }: GripButtonProps) {
  return (
    <button
      type="button"
      className="inline-grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-m border-2 border-transparent text-ink-700 focus-visible:text-ink-900 active:cursor-grabbing"
      aria-label={label}
      {...rest}
    >
      <Icon name="grip" size={22} />
    </button>
  )
}
