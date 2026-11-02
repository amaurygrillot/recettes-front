import { useRef, type RefObject } from 'react'

/**
 * Where the focus goes for a dialog opened by a button elsewhere (not a `Dialog.Trigger`, so Radix cannot give it
 * back): into a field of the dialog or its title when it opens, back to the opener when it closes. A combobox that
 * is open or holds text keeps its own Escape (it closes its list, then empties), so that Escape does not close the
 * dialog and drop what was chosen.
 */
export function useDialogFocus(
  initialFocusRef: RefObject<HTMLElement | null> | undefined,
  returnFocusTo: HTMLElement | null | undefined,
) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  return {
    titleRef,
    contentProps: {
      onOpenAutoFocus: (event: Event): void => {
        // Radix would focus the first control.
        event.preventDefault()
        opener.current =
          returnFocusTo ??
          (document.activeElement instanceof HTMLElement ? document.activeElement : null)
        const target = initialFocusRef?.current ?? titleRef.current
        target?.focus()
      },
      onCloseAutoFocus: (event: Event): void => {
        event.preventDefault()
        opener.current?.focus()
      },
      onEscapeKeyDown: (event: KeyboardEvent): void => {
        const { target } = event
        if (!(target instanceof HTMLInputElement) || target.getAttribute('role') !== 'combobox')
          return
        if (target.getAttribute('aria-expanded') === 'true' || target.value !== '') {
          event.preventDefault()
        }
      },
    },
  }
}
