import { useEffect, useState } from 'react'
import { clearCookingStep, readCookingStep, saveCookingStep } from '../../app/cookingProgress'
import { logger } from '../../lib/logger'

export interface CookingProgress {
  /** The step being cooked, counted from 1. */
  step: number
  /** The last step was passed: the screen of the end is shown. */
  finished: boolean
  previous: () => void
  /** The next step, or the end after the last one. */
  next: () => void
}

/**
 * Where the cook is in the steps. It starts where this device remembers the cook was (never past
 * the last step: the recipe may have lost some since), and remembers each step reached from the
 * second one, so that the recipe page can offer « Reprendre à l'étape 3 ». The first step and the end are
 * not worth coming back to: they forget it.
 */
export function useCookingProgress(recipeId: string, stepCount: number): CookingProgress {
  const [step, setStep] = useState(() =>
    Math.min(Math.max(readCookingStep(recipeId) ?? 1, 1), stepCount),
  )
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (finished || step === 1) clearCookingStep(recipeId)
    else saveCookingStep(recipeId, step)
  }, [recipeId, step, finished])

  return {
    step,
    finished,
    previous: () => {
      setStep((current) => Math.max(current - 1, 1))
    },
    next: () => {
      if (step < stepCount) {
        setStep(step + 1)
        return
      }
      logger.info('A recipe was cooked to its last step')
      setFinished(true)
    },
  }
}
