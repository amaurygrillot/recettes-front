import { createContext, use, useEffect } from 'react'

/**
 * How the phone's « + » behaves on the page being shown: `round` always (most pages),
 * `extends-at-top` shows its label at the top of the page and shrinks while the reader goes down
 * (a page with a feed), `hidden` when the page already has its own button for the same action.
 */
export type CreateButtonMode = 'round' | 'extends-at-top' | 'hidden'

export const DEFAULT_CREATE_BUTTON_MODE: CreateButtonMode = 'round'

type ChangeMode = (mode: CreateButtonMode) => void

/** The shell provides the setter; outside the shell (a screen under test) it does nothing. */
export const CreateButtonModeContext = createContext<ChangeMode>(() => undefined)

/**
 * Tells the shell how its « + » should look while this page is shown. The page goes back to the
 * default when it leaves, so a screen never has to undo what it asked for.
 */
export function useCreateButtonMode(mode: CreateButtonMode): void {
  const changeMode = use(CreateButtonModeContext)

  // The « + » belongs to the shell, outside the page: this is a message sent upwards, not state copied.
  useEffect(() => {
    changeMode(mode)
    return () => {
      changeMode(DEFAULT_CREATE_BUTTON_MODE)
    }
  }, [changeMode, mode])
}
