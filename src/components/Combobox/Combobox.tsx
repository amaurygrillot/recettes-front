import { useId } from 'react'
import { classNames } from '../../lib/classNames'
import { findWordStart } from '../../lib/normalizeText'
import { Icon } from '../Icon/Icon'
import { IconButton } from '../IconButton/IconButton'
import { strings } from './strings'
import { useCombobox, type ComboboxOption } from './useCombobox'

export type { ComboboxOption } from './useCombobox'

export interface ComboboxProps {
  /** Said by assistive technology; the placeholder is what the eye reads. */
  label: string
  placeholder: string
  /** The name of the list of suggestions. */
  suggestionsLabel: string
  options: readonly ComboboxOption[]
  /** The ids already chosen: they show as chosen in the list, and choosing one again removes it. */
  selectedIds: readonly string[]
  onToggle: (option: ComboboxOption) => void
  /** Said when nothing matches: « Aucune catégorie pour « xyz » ». */
  noResultText: (typed: string) => string
  /** Five by default, as designed. */
  maxSuggestions?: number
}

/** The letters typed are bold in each suggestion, as designed. */
function Highlighted({ text, typed }: { text: string; typed: string }) {
  const match = findWordStart(text, typed)
  if (match === undefined) return text
  const end = match.start + match.length
  return (
    <>
      {text.slice(0, match.start)}
      <b>{text.slice(match.start, end)}</b>
      {text.slice(end)}
    </>
  )
}

/**
 * A search field that suggests what exists as one types, to choose from (nothing is created
 * here). Suggestions open from the first letter, on the start of any word, without regard to
 * accents or case. Arrows move, Enter chooses, Escape closes the list and then empties the field.
 */
export function Combobox({
  label,
  placeholder,
  suggestionsLabel,
  options,
  selectedIds,
  onToggle,
  noResultText,
  maxSuggestions = 5,
}: ComboboxProps) {
  const inputId = useId()
  const combobox = useCombobox({ options, selectedIds, onToggle, maxSuggestions })
  const optionId = (index: number) => `${combobox.listboxId}-${index}`
  const activeId = combobox.activeIndex >= 0 ? optionId(combobox.activeIndex) : undefined
  const message = combobox.hasNoResult ? noResultText(combobox.typed.trim()) : combobox.announcement

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <span className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-ink-900">
          <Icon name="search" size={24} strokeWidth={2.4} />
        </span>
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={combobox.open}
          aria-controls={combobox.listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          value={combobox.typed}
          placeholder={placeholder}
          onChange={(event) => {
            combobox.type(event.target.value)
          }}
          onKeyDown={combobox.onKeyDown}
          className="h-14 w-full rounded-pill border-2 border-ink-500 bg-paper-50 pr-14 pl-13.5 text-label text-ink-900 placeholder:text-ink-700 focus:border-ink-900"
        />
        {combobox.typed !== '' && (
          <span className="absolute top-1 right-1">
            <IconButton
              label={strings.clear}
              icon="close"
              variant="bare"
              size="medium"
              onClick={combobox.clear}
            />
          </span>
        )}
      </div>
      <div
        id={combobox.listboxId}
        role="listbox"
        aria-label={suggestionsLabel}
        hidden={!combobox.open}
        className="overflow-hidden rounded-m border-2 border-ink-900 bg-paper-50 shadow-paper"
      >
        {combobox.suggestions.map((option, index) => {
          const selected = selectedIds.includes(option.id)
          return (
            // The options are not in the tab order: the keyboard works on the input, which points
            // at the active option (aria-activedescendant). The click is for the pointer only.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              key={option.id}
              id={optionId(index)}
              role="option"
              aria-selected={selected}
              tabIndex={-1}
              // The input keeps the focus: pressing a suggestion must not blur it first.
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={() => {
                combobox.choose(option)
              }}
              className={classNames(
                'flex min-h-14 cursor-pointer items-center gap-2 px-4 text-body text-ink-900 not-last:border-b-2 not-last:border-dotted not-last:border-ink-500',
                selected && 'bg-butter-300 font-bold',
                index === combobox.activeIndex &&
                  'bg-butter-100 outline-2 -outline-offset-2 outline-ink-900',
              )}
            >
              {selected && <Icon name="check" size={22} strokeWidth={3} />}
              <span>
                <Highlighted text={option.label} typed={combobox.typed} />
                {option.hint !== undefined && (
                  <>
                    {' '}
                    <span className="text-ink-700">· {option.hint}</span>
                  </>
                )}
              </span>
            </div>
          )
        })}
      </div>
      <p
        role="status"
        className={classNames(
          'text-detail font-bold',
          combobox.hasNoResult ? 'text-ink-800' : 'text-herb',
          message === '' && 'sr-only',
        )}
      >
        {message}
      </p>
    </div>
  )
}
