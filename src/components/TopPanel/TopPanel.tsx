import { Dialog } from 'radix-ui'
import type { ReactNode, RefObject } from 'react'
import { IconButton } from '../IconButton/IconButton'
import { useDialogFocus } from '../../lib/useDialogFocus'
import { strings } from './strings'

export interface TopPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The panel's name for assistive technology: « Rechercher ». It is not drawn, the field comes first. */
  title: string
  /** A field of the panel that takes the focus when it opens, in place of the title. */
  initialFocusRef?: RefObject<HTMLElement | null> | undefined
  /** What gets the focus back when the panel closes, when it is not the element focused as it opened. */
  returnFocusTo?: HTMLElement | null | undefined
  /** At the top, beside the close button: the field. */
  toolbar?: ReactNode
  /** The part that scrolls. */
  children: ReactNode
  /** Fixed at the bottom, always in view: the buttons that answer the panel. */
  actions?: ReactNode
}

/**
 * The desktop's counterpart of the bottom sheet: a panel of 800 px that hangs under the top bar, which stays sharp,
 * with the page dimmed beneath. A touch on the dimmed page, Escape or the close button closes it without applying anything.
 */
export function TopPanel({
  open,
  onOpenChange,
  title,
  initialFocusRef,
  returnFocusTo,
  toolbar,
  children,
  actions,
}: TopPanelProps) {
  const { titleRef, contentProps } = useDialogFocus(initialFocusRef, returnFocusTo)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-x-0 top-22 bottom-0 z-50 bg-ink-900/58" />
        <Dialog.Content
          aria-describedby={undefined}
          {...contentProps}
          className="fixed top-25 left-1/2 z-50 flex max-h-top-panel w-[calc(100%-8rem)] max-w-panel -translate-x-1/2 flex-col overflow-hidden rounded-sheet border-2 border-ink-900 bg-paper-50 shadow-sheet"
        >
          <Dialog.Title ref={titleRef} tabIndex={-1} className="sr-only">
            {title}
          </Dialog.Title>
          <div className="flex items-start gap-3 px-7 pt-6 pb-4">
            <div className="min-w-0 flex-1">{toolbar}</div>
            <Dialog.Close asChild>
              <IconButton label={strings.close} icon="close" variant="bare" />
            </Dialog.Close>
          </div>
          <div className="relative min-h-0 flex-1 overflow-y-auto px-7 pb-6">{children}</div>
          {actions && (
            <div className="flex justify-end gap-3 border-t-2 border-ink-900 bg-paper-50 px-7 py-4">
              {actions}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
