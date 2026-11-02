import { useEffect, type RefObject } from 'react'
import { MAX_QUERY_LENGTH } from '../../../../app/searchCriteria'
import { SearchPill } from '../../../../components/SearchPill/SearchPill'
import { strings as appStrings } from '../../../../app/strings'
import { strings } from '../../strings'

export interface SearchTextFieldProps {
  value: string
  onChange: (text: string) => void
  /** Enter: validates the search (the overlay decides whether there is something to search for). */
  onSubmit: () => void
  inputRef: RefObject<HTMLInputElement | null>
}

/**
 * The title field of the search overlay: a pill of 56 px, and Enter to search. At 200 characters the
 * typing stops and the field says so.
 */
export function SearchTextField({ value, onChange, onSubmit, inputRef }: SearchTextFieldProps) {
  const atLimit = value.length >= MAX_QUERY_LENGTH

  // A text that starts filled (a search to refine, a key carried over) is continued, not selected or prepended to.
  useEffect(() => {
    const input = inputRef.current
    input?.setSelectionRange(input.value.length, input.value.length)
  }, [inputRef])

  return (
    <form
      role="search"
      aria-label={strings.field.landmark}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-1.5"
    >
      <SearchPill
        label={appStrings.navigation.searchField}
        value={value}
        onChange={onChange}
        clearLabel={appStrings.navigation.clearSearch}
        maxLength={MAX_QUERY_LENGTH}
        invalid={atLimit}
        inputRef={inputRef}
      />
      {atLimit && (
        <div className="flex justify-between gap-3 px-1 text-detail font-bold text-brick">
          <p>{strings.field.limit(MAX_QUERY_LENGTH)}</p>
          <p>{strings.field.counter(value.length, MAX_QUERY_LENGTH)}</p>
        </div>
      )}
    </form>
  )
}
