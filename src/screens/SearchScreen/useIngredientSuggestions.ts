import { useState } from 'react'
import { useIngredientSearch } from '../../api/ingredients'
import type { ComboboxOption } from '../../components/Combobox/Combobox'
import { normalizeText } from '../../lib/normalizeText'
import { useDebouncedValue } from '../../lib/useDebouncedValue'

/** The field suggests few, as the design does: the typing narrows them. */
const SUGGESTION_COUNT = 6
/** The typing has to pause this long before the back end is asked. */
const SEARCH_AFTER_MS = 200

/**
 * The ingredients that start like what is typed in the filter, asked of the back end as the typing
 * pauses (there are too many to load in advance, unlike the categories and the tags). Only ingredients
 * that start with the text are suggested: while the next answer comes, the previous one stays, and what
 * no longer matches is not offered.
 */
export function useIngredientSuggestions() {
  const [typed, setTyped] = useState('')
  const wanted = typed.trim()
  const searched = useDebouncedValue(wanted, SEARCH_AFTER_MS)
  const search = useIngredientSearch(
    { namePrefix: searched, size: SUGGESTION_COUNT },
    searched !== '',
  )

  const options: ComboboxOption[] =
    wanted === ''
      ? []
      : (search.data?.content ?? []).flatMap(({ id, name }) =>
          id !== undefined &&
          name !== undefined &&
          normalizeText(name).startsWith(normalizeText(wanted))
            ? [{ id, label: name }]
            : [],
        )

  return {
    options,
    type: setTyped,
    /** The answer for the text typed is not in yet (or could not come): « nothing found » must not be said. */
    searching: wanted !== '' && (searched !== wanted || search.isFetching || search.isError),
    /** The search itself failed: it is not that nothing matches. */
    failed: wanted !== '' && search.isError,
  }
}
