import { createContext, use } from 'react'

/** Whether the recipe is on its way to the back end: the text fields that are not inputs are then locked. */
export const SavingContext = createContext(false)

export function useSaving(): boolean {
  return use(SavingContext)
}
