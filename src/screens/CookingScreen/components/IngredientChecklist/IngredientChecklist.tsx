import { Icon } from '../../../../components/Icon/Icon'
import { classNames } from '../../../../lib/classNames'
import type { IngredientGroupView } from '../../../../app/recipeView'
import type { IngredientChecks } from '../../useIngredientChecks'

export interface IngredientChecklistProps {
  groups: readonly IngredientGroupView[]
  checks: IngredientChecks
}

/**
 * The ingredients to tick as they are set out, in their groups. Each line is touched as a whole (64 px
 * high, a 36 px box): a line that is ready is faded and struck through, which stays readable (6.9:1)
 * and is a second sign beside the yellow box.
 */
export function IngredientChecklist({ groups, checks }: IngredientChecklistProps) {
  return (
    <div className="flex flex-col">
      {groups.map((group, groupIndex) => (
        // A group has no id of its own; the list is written once and never reordered here.
        <div key={`${groupIndex}-${group.title ?? ''}`} className="flex flex-col">
          {group.title !== undefined && (
            <h3 className="pt-4 pb-1 text-label font-bold text-ink-900">{group.title}</h3>
          )}
          {group.lines.map((line, lineIndex) => {
            const ready = checks.isReady(groupIndex, lineIndex)
            return (
              <label
                key={`${lineIndex}-${line.name}`}
                className="flex min-h-16 cursor-pointer items-center gap-4 border-b border-dashed border-ink-500"
              >
                <input
                  type="checkbox"
                  checked={ready}
                  onChange={() => {
                    checks.toggle(groupIndex, lineIndex)
                  }}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={classNames(
                    'grid size-9 shrink-0 place-items-center rounded-s border-2 text-ink-900 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink-900',
                    ready ? 'border-ink-900 bg-butter-300' : 'border-ink-500 bg-paper-50',
                  )}
                >
                  {ready && <Icon name="check" size={24} strokeWidth={3} />}
                </span>
                <span
                  className={classNames(
                    'text-label',
                    ready ? 'text-ink-700 line-through decoration-2' : 'text-ink-900',
                  )}
                >
                  {line.quantity !== undefined && <b>{line.quantity} </b>}
                  {line.unit}
                  {line.name}
                  {line.note !== undefined && (
                    <span className="text-body text-ink-800"> {line.note}</span>
                  )}
                </span>
              </label>
            )
          })}
        </div>
      ))}
    </div>
  )
}
