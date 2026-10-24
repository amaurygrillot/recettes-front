import { Button } from '../../../../components/Button/Button'
import { Icon } from '../../../../components/Icon/Icon'
import { strings } from '../../strings'
import type { CreationOutcome } from '../../useIngredientChoice'

const { ingredients } = strings

export interface IngredientNoticeProps {
  outcome: CreationOutcome
  /** Creating the ingredient again, after a failure. */
  onRetry: () => void
}

/**
 * What became of making an ingredient exist, under its line: made (a green tick), already there (said
 * calmly, as it is no one's fault: the one that exists was chosen) or failed (in brick, with the way to
 * try again; what was typed is still there).
 */
export function IngredientNotice({ outcome, onRetry }: IngredientNoticeProps) {
  if (outcome.kind === 'failed') {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center gap-2.5 rounded-m border-2 border-brick bg-brick-bg px-3 py-2.5 text-brick"
      >
        <Icon name="alert" size={22} strokeWidth={2.4} />
        <p className="min-w-40 flex-1 text-detail font-bold">
          {ingredients.createFailed(outcome.name)}
        </p>
        <Button variant="secondary" size="medium" icon="refresh" onClick={onRetry}>
          {strings.retry}
        </Button>
      </div>
    )
  }

  if (outcome.kind === 'existed') {
    return (
      <p role="status" className="flex items-start gap-2 text-detail font-bold text-ink-800">
        <Icon name="info" size={22} strokeWidth={2.4} />
        {ingredients.exists(outcome.name)}
      </p>
    )
  }

  return (
    <p role="status" className="flex items-start gap-2 text-detail font-bold text-herb">
      <Icon name="check-circle" size={22} strokeWidth={2.4} />
      {ingredients.created}
    </p>
  )
}
