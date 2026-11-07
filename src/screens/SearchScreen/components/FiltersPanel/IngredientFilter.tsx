import { useIngredientNames, useRememberIngredient } from '../../../../api/ingredients'
import { MAX_INGREDIENT_FILTERS } from '../../../../app/searchCriteria'
import { Combobox, type ComboboxOption } from '../../../../components/Combobox/Combobox'
import { RemovableChip } from '../../../../components/RemovableChip/RemovableChip'
import { logger } from '../../../../lib/logger'
import { strings } from '../../strings'
import { useIngredientSuggestions } from '../../useIngredientSuggestions'

const { filters } = strings
const { ingredients } = filters

export interface IngredientFilterProps {
  /** The ingredients a recipe must all use, in the order they were chosen. */
  ingredientIds: readonly string[]
  onChange: (ingredientIds: string[]) => void
  /** The narrow column of a desktop: the search field carries a short placeholder. */
  dense: boolean
}

/**
 * The ingredients to cook with: a search field that suggests what exists as one types (the back end is
 * asked, there are too many to list), the ones chosen as chips that go away with one touch, and what that
 * means for the list (« Recettes avec tous ces ingrédients »). The choice holds ids, as the address does;
 * a name is remembered when it is picked and looked up otherwise, so a chip shows once its name is known.
 */
export function IngredientFilter({ ingredientIds, onChange, dense }: IngredientFilterProps) {
  const suggestions = useIngredientSuggestions()
  const names = useIngredientNames(ingredientIds)
  const remember = useRememberIngredient()
  const full = ingredientIds.length >= MAX_INGREDIENT_FILTERS

  function toggle(option: ComboboxOption): void {
    if (ingredientIds.includes(option.id)) {
      onChange(ingredientIds.filter((id) => id !== option.id))
      return
    }
    logger.debug('An ingredient was chosen as a filter', { count: ingredientIds.length + 1 })
    remember(option.id, option.label)
    onChange([...ingredientIds, option.id])
  }

  return (
    <>
      {full ? (
        <p className="text-body text-ink-800">{ingredients.limit(MAX_INGREDIENT_FILTERS)}</p>
      ) : (
        <Combobox
          label={ingredients.searchLabel}
          placeholder={dense ? filters.searchShort : ingredients.searchLabel}
          suggestionsLabel={ingredients.suggestions}
          options={suggestions.options}
          selectedIds={ingredientIds}
          onToggle={toggle}
          onTyped={suggestions.type}
          searching={suggestions.searching}
          noResultText={ingredients.noResult}
        />
      )}
      {suggestions.failed && !full && (
        <p role="alert" className="text-detail font-bold text-brick">
          {ingredients.searchFailed}
        </p>
      )}
      {ingredientIds.length > 0 && (
        <ul aria-label={ingredients.chosen} className="flex flex-wrap gap-2.5">
          {ingredientIds.flatMap((id) => {
            const name = names.get(id)
            if (name === undefined) return []
            return [
              <li key={id}>
                <RemovableChip
                  icon="cutlery"
                  label={name}
                  removeLabel={ingredients.remove(name)}
                  onRemove={() => {
                    onChange(ingredientIds.filter((chosen) => chosen !== id))
                  }}
                />
              </li>,
            ]
          })}
        </ul>
      )}
      <p className="text-detail text-ink-800">
        {ingredientIds.length === 0 ? ingredients.none : ingredients.all}
      </p>
    </>
  )
}
