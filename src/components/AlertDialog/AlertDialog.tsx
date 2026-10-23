import { AlertDialog as Primitive } from 'radix-ui'
import type { ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

export interface AlertDialogProps {
  open: boolean
  /** In the round butter badge above the title. */
  icon: IconName
  /** What happened, in a few words: « Ta session a expiré. » */
  title: string
  /** Why, and what happens next. */
  description: string
  /**
   * The Buttons that answer it. The first one takes the focus when the dialog opens, so the safe
   * answer comes first.
   */
  children: ReactNode
}

/**
 * A dialog the user must answer: no close cross, and neither a click beside it nor Escape closes
 * it (`open` is the caller's alone). Announced as an alert dialog, focus kept inside.
 */
export function AlertDialog({ open, icon, title, description, children }: AlertDialogProps) {
  return (
    <Primitive.Root open={open}>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink-900/58 p-5">
          <Primitive.Content
            onOpenAutoFocus={(event) => {
              // Radix would focus a « Cancel » part, which a dialog with a single answer does not have.
              event.preventDefault()
              if (event.currentTarget instanceof HTMLElement) {
                event.currentTarget.querySelector<HTMLElement>('button, a[href]')?.focus()
              }
            }}
            className="max-w-md flex w-full flex-col gap-3.5 rounded-xl border-2 border-ink-900 bg-paper-50 px-5 pt-6 pb-5 shadow-sheet"
          >
            <div className="grid size-14 shrink-0 place-items-center self-center rounded-full border-3 border-ink-900 bg-butter-200 text-ink-900">
              <Icon name={icon} size={28} strokeWidth={2.4} />
            </div>
            <Primitive.Title className="text-center font-title text-dialog-title text-ink-900">
              {title}
            </Primitive.Title>
            <Primitive.Description className="text-center text-body text-ink-800">
              {description}
            </Primitive.Description>
            <div className="mt-1 flex flex-col gap-3">{children}</div>
          </Primitive.Content>
        </Primitive.Overlay>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
