import { MAX_QUERY_LENGTH } from '../../../../app/searchCriteria'
import { useSearchText } from '../../../../app/useSearchText'
import { SearchPill } from '../../../../components/SearchPill/SearchPill'
import { strings } from '../../strings'

/**
 * The field of the search page on a phone and a tablet (a desktop searches from the bar): a pill
 * of 56 px, no button, results following a short pause in the typing. At 200 characters the
 * typing stops and the field says so.
 */
export function SearchField() {
  const field = useSearchText()
  const atLimit = field.text.length >= MAX_QUERY_LENGTH

  return (
    <form
      role="search"
      aria-label={strings.field.landmark}
      onSubmit={(event) => {
        event.preventDefault()
        field.submit()
      }}
      className="flex min-w-0 flex-1 flex-col gap-1.5"
    >
      <SearchPill
        label={strings.field.label}
        value={field.text}
        onChange={(text) => {
          if (text === '') field.clear()
          else field.change(text)
        }}
        clearLabel={strings.field.clear}
        maxLength={MAX_QUERY_LENGTH}
        invalid={atLimit}
      />
      {atLimit && (
        <div className="flex justify-between gap-3 px-1 text-detail font-bold text-brick">
          <p>{strings.field.limit(MAX_QUERY_LENGTH)}</p>
          <p>{strings.field.counter(field.text.length, MAX_QUERY_LENGTH)}</p>
        </div>
      )}
    </form>
  )
}
