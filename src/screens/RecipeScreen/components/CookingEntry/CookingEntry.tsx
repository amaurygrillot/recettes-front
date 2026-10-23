import { createPortal } from 'react-dom'
import { useBottomSlot } from '../../../../app/bottomSlot'
import { readCookingStep } from '../../../../app/cookingProgress'
import { paths } from '../../../../app/paths'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { TABLET_QUERY } from '../../../../lib/breakpoints'
import { useMediaQuery } from '../../../../lib/useMediaQuery'
import { useScrolledPast } from '../../../../lib/useScrolledPast'
import { strings } from '../../strings'

export interface CookingEntryProps {
  recipeId: string
  /** How many steps the recipe has: the way into the step-by-step mode only exists with at least one. */
  stepCount: number
}

/**
 * « Cuisiner pas à pas » (or « Reprendre à l'étape N » when this device remembers one), between
 * the ingredients and the preparation. On a phone, once the button has gone up out of the screen,
 * the same action stays in a bar above the tabs. Nothing for a recipe with no steps.
 */
export function CookingEntry({ recipeId, stepCount }: CookingEntryProps) {
  const { past: scrolledPast, ref: pageButton } = useScrolledPast()
  const isTabletOrMore = useMediaQuery(TABLET_QUERY)
  const slot = useBottomSlot()

  if (stepCount === 0) return null

  const reached = readCookingStep(recipeId)
  const label =
    reached !== undefined && reached <= stepCount
      ? strings.cooking.resume(reached)
      : strings.cooking.start
  const button = (
    <LinkButton to={paths.cooking(recipeId)} icon="chef-hat" fullWidth>
      {label}
    </LinkButton>
  )

  return (
    <>
      <div ref={pageButton}>{button}</div>
      {scrolledPast && !isTabletOrMore && slot !== null
        ? createPortal(
            <div className="border-t-2 border-ink-900 bg-paper-50 px-4 py-3 shadow-bar">
              {button}
            </div>,
            slot,
          )
        : null}
    </>
  )
}
