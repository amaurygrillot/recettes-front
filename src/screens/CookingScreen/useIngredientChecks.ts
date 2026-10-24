import { useState } from 'react'
import type { IngredientGroupView } from '../../app/recipeView'

/** Where a line is: the position of its group and its own position in it (a group has no id of its own). */
export const lineKey = (group: number, line: number) => `${group}.${line}`

export interface IngredientChecks {
  /** How many lines there are in all. */
  total: number
  /** How many are ready. */
  ready: number
  isReady: (group: number, line: number) => boolean
  toggle: (group: number, line: number) => void
}

/**
 * The ingredients the cook has set out, ticked in the list. They are kept while the recipe is open
 * (the list can be closed and opened again, or the step changed) and forgotten with it: nothing is
 * stored, since what was set out an hour ago says nothing about the next time.
 */
export function useIngredientChecks(groups: readonly IngredientGroupView[]): IngredientChecks {
  const [ticked, setTicked] = useState<ReadonlySet<string>>(new Set())
  const total = groups.reduce((sum, group) => sum + group.lines.length, 0)

  return {
    total,
    ready: ticked.size,
    isReady: (group, line) => ticked.has(lineKey(group, line)),
    toggle: (group, line) => {
      setTicked((current) => {
        const next = new Set(current)
        const key = lineKey(group, line)
        if (!next.delete(key)) next.add(key)
        return next
      })
    },
  }
}
