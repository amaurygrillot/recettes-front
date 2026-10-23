import { strings } from '../../strings'
import type { IngredientGroupView } from '../../recipeView'

export interface IngredientsSectionProps {
  groups: readonly IngredientGroupView[]
}

/**
 * The ingredients in groups with a heading (« Pour la pâte »), a line each with its quantity in
 * bold and its note quieter, in the largest text of the page since this is read at the stove.
 */
export function IngredientsSection({ groups }: IngredientsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-title text-page-title text-ink-900">{strings.ingredients.title}</h2>
      {groups.map((group, position) => (
        // A group has no id of its own; the list is written once and never reordered here.
        <div key={`${position}-${group.title ?? ''}`} className="flex flex-col">
          {group.title !== undefined && (
            <h3 className="mt-3.5 font-title text-title-3 text-ink-900">{group.title}</h3>
          )}
          <ul>
            {group.lines.map((line, lineNumber) => (
              <li
                key={`${lineNumber}-${line.name}`}
                className="border-b border-dashed border-ink-500 py-3.25 text-step text-ink-900"
              >
                {line.quantity !== undefined && <b>{line.quantity} </b>}
                {line.unit}
                {line.name}
                {line.note !== undefined && (
                  <span className="text-label text-ink-700"> {line.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
