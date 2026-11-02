import { Dialog } from 'radix-ui'
import { useRef, type ReactNode, type RefObject } from 'react'
import { IconButton } from '../IconButton/IconButton'
import { strings } from './strings'

export interface TopPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The panel's name and heading: « Rechercher ». */
  title: string
  /** A field of the panel that takes the focus when it opens, in place of the title. */
  initialFocusRef?: RefObject<HTMLElement | null> | undefined
  /** Under the title and fixed: the field. */
  toolbar?: ReactNode
  /** The part that scrolls. */
  children: ReactNode
  /** Fixed at the bottom, always in view: the buttons that answer the panel. */
  actions?: ReactNode
}

/**
 * The desktop's counterpart of the bottom sheet: a panel that hangs under the top bar, which stays sharp, with
 * the page dimmed beneath. A touch on the dimmed page, Escape or the close button closes it without applying anything.
 */
export function TopPanel({
  open,
  onOpenChange,
  title,
  initialFocusRef,
  toolbar,
  children,
  actions,
}: TopPanelProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  // The panel is opened by a button elsewhere, not by a Dialog.Trigger, so Radix cannot give it back the focus.
  const opener = useRef<HTMLElement | null>(null)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-x-0 top-22 bottom-0 z-50 bg-ink-900/58" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            opener.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null
            const target = initialFocusRef?.current ?? titleRef.current
            target?.focus()
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            opener.current?.focus()
          }}
          className="fixed top-22 left-1/2 z-50 flex max-h-sheet w-[calc(100%-8rem)] max-w-content -translate-x-1/2 flex-col overflow-hidden rounded-b-sheet border-2 border-t-0 border-ink-900 bg-paper-50 shadow-sheet"
        >
          <div className="flex items-center justify-between gap-3 px-8 pt-5">
            <Dialog.Title
              ref={titleRef}
              tabIndex={-1}
              className="font-title text-title-2 text-ink-900 outline-none"
            >
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton label={strings.close} icon="close" variant="bare" />
            </Dialog.Close>
          </div>
          {toolbar && <div className="px-8 pt-1 pb-3">{toolbar}</div>}
          <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6">{children}</div>
          {actions && (
            <div className="flex justify-end gap-3 border-t-2 border-ink-900 bg-paper-50 px-8 py-4">
              {actions}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
