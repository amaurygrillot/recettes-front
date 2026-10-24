import { BottomSheet } from '../../../../components/BottomSheet/BottomSheet'
import { Button } from '../../../../components/Button/Button'
import { Icon } from '../../../../components/Icon/Icon'
import type { IngredientGroupView } from '../../../../app/recipeView'
import { strings } from '../../strings'
import type { IngredientChecks } from '../../useIngredientChecks'
import { IngredientChecklist } from '../IngredientChecklist/IngredientChecklist'

const { ingredients } = strings

interface IngredientsProps {
  groups: readonly IngredientGroupView[]
  checks: IngredientChecks
}

export interface IngredientsButtonProps {
  checks: IngredientChecks
  /** The button of the foot of a phone: a whole row, with how many are ready on its right. */
  onClick: () => void
}

/** « Ingrédients », a full-width row above the buttons of the foot, within reach of the thumb. */
export function IngredientsButton({ checks, onClick }: IngredientsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 w-full cursor-pointer items-center gap-2.5 rounded-l border-2 border-ink-900 bg-paper-50 px-4 text-label font-bold text-ink-900 focus-visible:outline-offset-4 enabled:active:bg-butter-200"
    >
      <Icon name="cutlery" size={24} strokeWidth={2.4} />
      {ingredients.title}
      {checks.ready > 0 && (
        <span className="ml-auto text-body font-normal text-ink-800">
          {ingredients.ready(checks.ready, checks.total)}
        </span>
      )}
    </button>
  )
}

export interface IngredientsSheetProps extends IngredientsProps {
  open: boolean
  onClose: () => void
}

/**
 * The list of a phone: the sheet of the system, from the bottom. The step stays under it (nothing
 * is left), Escape or a touch on the page closes it and the focus goes back to its button.
 */
export function IngredientsSheet({ open, onClose, groups, checks }: IngredientsSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      title={ingredients.title}
      toolbar={
        <p className="px-5 pb-1 text-detail text-ink-800">
          {ingredients.ready(checks.ready, checks.total)}
        </p>
      }
      actions={
        <Button variant="secondary" fullWidth onClick={onClose}>
          {ingredients.close}
        </Button>
      }
    >
      <IngredientChecklist groups={groups} checks={checks} />
    </BottomSheet>
  )
}

export interface IngredientsPanelProps extends IngredientsProps {
  onClose: () => void
}

/** The list of a tablet or a desktop: a panel on the right (the step moves aside, it does not narrow), closed by its cross. */
export function IngredientsPanel({ groups, checks, onClose }: IngredientsPanelProps) {
  return (
    <aside
      aria-label={ingredients.title}
      className="flex h-dvh w-80 shrink-0 flex-col border-l-2 border-ink-900 bg-paper-50 desktop:w-105"
    >
      <div className="flex items-center justify-between gap-3 pt-5 pr-4 pb-2 pl-6">
        <div>
          <h2 className="font-title text-page-title">{ingredients.title}</h2>
          <p className="mt-0.5 text-detail text-ink-800">
            {ingredients.ready(checks.ready, checks.total)}
          </p>
        </div>
        <button
          type="button"
          aria-label={ingredients.closePanel}
          onClick={onClose}
          className="grid size-14 shrink-0 cursor-pointer place-items-center rounded-l border-2 border-ink-900 bg-paper-50 text-ink-900 focus-visible:outline-offset-3 enabled:active:bg-butter-200"
        >
          <Icon name="close" size={24} strokeWidth={2.6} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <IngredientChecklist groups={groups} checks={checks} />
      </div>
    </aside>
  )
}
