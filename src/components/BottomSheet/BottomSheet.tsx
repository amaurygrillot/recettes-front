import { Dialog } from 'radix-ui'
import { useRef, type ReactNode, type UIEvent } from 'react'
import { IconButton } from '../IconButton/IconButton'
import { strings } from './strings'

export interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The sheet's name and heading: « Filtres ». The focus lands on it when the sheet opens. */
  title: string
  /** Under the title and fixed: the section pills of a long sheet. */
  toolbar?: ReactNode
  /** The part that scrolls. */
  children: ReactNode
  /** Fixed at the bottom, always in view: the buttons that answer the sheet. */
  actions?: ReactNode
  onContentScroll?: (event: UIEvent<HTMLDivElement>) => void
}

/**
 * A panel that rises from the bottom of a phone and is centered on a tablet: handle, title and
 * close button, a scrolling body, fixed actions. A touch on the dimmed page, Escape or the close
 * button closes it without applying anything; the focus comes back to what opened it.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  toolbar,
  children,
  actions,
  onContentScroll,
}: BottomSheetProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  // The sheet is opened by a button elsewhere, not by a Dialog.Trigger, so Radix cannot give it back the focus.
  const opener = useRef<HTMLElement | null>(null)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/58" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            // Radix would focus the first control; the sheet starts at its title, as designed.
            event.preventDefault()
            opener.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null
            titleRef.current?.focus()
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            opener.current?.focus()
          }}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-sheet flex-col overflow-hidden rounded-t-sheet border-2 border-b-0 border-ink-900 bg-paper-50 shadow-sheet tablet:inset-auto tablet:top-1/2 tablet:left-1/2 tablet:w-[calc(100%-4rem)] tablet:max-w-reading tablet:-translate-x-1/2 tablet:-translate-y-1/2 tablet:rounded-sheet tablet:border-b-2"
        >
          <Dialog.Close
            aria-label={strings.handle}
            className="mx-auto flex h-11 w-24 shrink-0 cursor-pointer items-center justify-center tablet:hidden"
          >
            <span aria-hidden="true" className="h-1.5 w-12 rounded-pill bg-ink-500" />
          </Dialog.Close>
          <div className="flex items-center justify-between gap-3 px-5 pt-1 tablet:pt-4">
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
          {toolbar}
          <div onScroll={onContentScroll} className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
            {children}
          </div>
          {actions && (
            <div className="flex gap-3 border-t-2 border-ink-900 bg-paper-50 px-5 pt-3 pb-safe-bar">
              {actions}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
