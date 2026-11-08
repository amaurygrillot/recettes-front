import { Dialog } from 'radix-ui'
import type { ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import type { LayoutKind } from '../../lib/useLayoutKind'
import { Icon } from '../Icon/Icon'
import { strings } from './strings'

export interface WritingModeProps {
  open: boolean
  /** The name of the field, in the strip at the top: « Introduction », « Texte de l'étape ». */
  title: string
  /** Said next to the name (« facultatif »). */
  note?: string | undefined
  /**
   * A panel on a desktop, the whole screen on a phone and a tablet. The bar sits at the bottom, above the keyboard, on
   * a phone and under the strip from a tablet; the back arrow is a phone's.
   */
  layout: LayoutKind
  /** How many pixels of the bottom of the screen a phone's keyboard covers: the bar sits above it. */
  keyboardInset: number
  onClose: () => void
  /** The bar of tools, at the bottom of the screen or of the panel. */
  toolbar: ReactNode
  /** The text itself: the editor is moved here while the mode is open. */
  children: ReactNode
}

const PANELS = {
  screen: 'fixed inset-x-0 top-0 flex flex-col bg-paper-50',
  panel:
    'fixed inset-y-8 left-1/2 flex w-230 max-w-full -translate-x-1/2 flex-col overflow-hidden rounded-xl border-3 border-ink-900 bg-paper-50 shadow-stamp',
}

/**
 * The text on a screen of its own: a strip with the way back, the name of the field and « Terminé », the text
 * filling the space down to the bar of tools. A modal (focus kept inside, the page behind inert and still), closed by
 * « Terminé », the arrow, Escape or a click on the dimmed part. The text is the editor's own, only moved here: it is left
 * out as soon as the mode is closed, not when the dialog finishes leaving, or it would take the editor back from the field.
 */
export function WritingMode({
  open,
  title,
  note,
  layout,
  keyboardInset,
  onClose,
  toolbar,
  children,
}: WritingModeProps) {
  const desktop = layout === 'desktop'
  const phone = layout === 'phone'
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/58" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            // The text takes the focus itself once it is here (the editor puts its caret back); not a button of the strip.
            event.preventDefault()
          }}
          onCloseAutoFocus={(event) => {
            // The field decides where the focus goes: back in the text on a tablet and a desktop, nowhere on a phone.
            event.preventDefault()
          }}
          style={desktop ? undefined : { bottom: keyboardInset }}
          className={classNames('z-50 outline-none', desktop ? PANELS.panel : PANELS.screen)}
        >
          <header className="flex flex-none items-center gap-2.5 border-b-2 border-paper-300 px-3 py-2.5 tablet:px-8 tablet:py-3">
            {phone && (
              <button
                type="button"
                aria-label={strings.writing.back}
                onClick={onClose}
                className="grid size-12 flex-none cursor-pointer place-items-center rounded-m border-2 border-ink-900 bg-paper-50 p-0 text-ink-900 focus-visible:outline-offset-2 active:bg-butter-200"
              >
                <Icon name="chevron-left" size={26} strokeWidth={2.6} />
              </button>
            )}
            <div className="min-w-0 flex-1 px-1">
              <div className="flex items-baseline gap-2">
                {/* « Introduction » is one word, wider than what is left of a 320 px strip beside « Terminé »: it breaks. */}
                <Dialog.Title className="line-clamp-2 font-title text-title-3 font-extrabold [overflow-wrap:anywhere] hyphens-auto text-ink-900">
                  {title}
                </Dialog.Title>
                {note && (
                  <span className="hidden flex-none text-detail text-ink-700 tablet:inline">
                    {note}
                  </span>
                )}
              </div>
              {desktop && <p className="text-detail text-ink-700">{strings.writing.escapeHint}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-16 w-32 flex-none cursor-pointer items-center justify-center gap-2.5 rounded-l border-2 border-ink-900 bg-butter-300 text-label font-bold text-ink-900 shadow-stamp-sm focus-visible:outline-offset-2 active:translate-y-0.5 active:bg-butter-400 active:shadow-none tablet:w-38"
            >
              <Icon name="check" size={24} strokeWidth={2.6} />
              {strings.writing.done}
            </button>
          </header>
          {!phone && <div className="flex-none border-b-2 border-paper-300">{toolbar}</div>}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto min-h-full w-full max-w-190 px-4 pt-4 pb-6 tablet:px-16 tablet:pt-7 desktop:px-0">
              {open ? children : null}
            </div>
          </div>
          {phone && <div className="flex-none border-t-2 border-ink-900">{toolbar}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
