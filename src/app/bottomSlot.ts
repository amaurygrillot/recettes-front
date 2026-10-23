import { createContext, use } from 'react'

/** The place above the phone's tabs where a page may show a bar of its own (a portal target). */
export const BottomSlotContext = createContext<HTMLElement | null>(null)

/** The element to render a bottom bar into, or none until the shell has mounted (and on a desktop it is hidden). */
export function useBottomSlot(): HTMLElement | null {
  return use(BottomSlotContext)
}
