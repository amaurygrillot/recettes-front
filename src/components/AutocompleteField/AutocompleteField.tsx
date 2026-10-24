import { useId, useState, type KeyboardEvent } from 'react'
import { classNames } from '../../lib/classNames'
import { findWordStart } from '../../lib/normalizeText'
import { Icon } from '../Icon/Icon'
import { Spinner } from '../Spinner/Spinner'
import { FieldLabel } from '../TextField/fieldParts'

export interface Suggestion {
  id: string
  label: string
}

export interface AutocompleteFieldProps {
  label: string
  placeholder?: string | undefined
  /** The name of the list of suggestions: « Ingrédients existants ». */
  suggestionsLabel: string
  /** What is typed: the field does not keep it, so that the one who uses it can empty or fill it. */
  text: string
  onTextChange: (text: string) => void
  maxLength?: number | undefined
  /** What exists and starts like what was typed, best first. Nothing is chosen by itself. */
  suggestions: readonly Suggestion[]
  onChoose: (suggestion: Suggestion) => void
  /** A last line, set apart, that makes what was typed exist: « Créer « farine » ». */
  create?: { label: string; onCreate: () => void } | undefined
  /** What the list says instead of suggestions while something is being made: « Création de « farine »… ». */
  busyText?: string | undefined
  /** Locked, in dashes: the one who uses it is waiting for something. */
  disabled?: boolean
  /** The frame of an error whose words are said elsewhere. */
  invalid?: boolean
  /** The `id` of what says why it is invalid. */
  describedBy?: string | undefined
}

/** The letters typed are in bold in each suggestion. */
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

const OPTION =
  'flex min-h-14 cursor-pointer items-center gap-2.5 rounded-s border-2 px-3 text-label text-ink-900'

/**
 * A text field that suggests what exists as one types, to choose from, and can offer to make what was
 * typed exist. The list opens under the field, in the flow of the page (it does not float over the
 * fields below). Arrows move through the list, Enter chooses what is lit, Escape closes it. Nothing is
 * ever chosen without being asked: leaving the field with some text typed chooses nothing.
 */
export function AutocompleteField({
  label,
  placeholder,
  suggestionsLabel,
  text,
  onTextChange,
  maxLength,
  suggestions,
  onChoose,
  create,
  busyText,
  disabled = false,
  invalid = false,
  describedBy,
}: AutocompleteFieldProps) {
  const id = useId()
  const listboxId = `${id}-list`
  const [focused, setFocused] = useState(false)
  // Closed by choosing and by Escape, reopened by the next letter.
  const [dismissed, setDismissed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const choices: readonly { key: string; run: () => void }[] = [
    ...suggestions.map((suggestion) => ({
      key: suggestion.id,
      run: () => {
        onChoose(suggestion)
      },
    })),
    ...(create === undefined ? [] : [{ key: 'create', run: create.onCreate }]),
  ]
  // The results can come back fewer than when the arrows were last used.
  const lit = activeIndex < choices.length ? activeIndex : -1
  const typed = text.trim()
  const busy = busyText !== undefined
  // What is being made is said in the list even though the field no longer has the focus (it is locked).
  const open = busy || (focused && !dismissed && typed !== '' && choices.length > 0)
  const optionId = (index: number) => `${listboxId}-${index}`

  function choose(index: number): void {
    const choice = choices[index]
    if (choice === undefined) return
    setDismissed(true)
    setActiveIndex(-1)
    choice.run()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setDismissed(true)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (choices.length === 0) return
      event.preventDefault()
      setDismissed(false)
      setActiveIndex(
        event.key === 'ArrowDown'
          ? (lit + 1) % choices.length
          : (lit <= 0 ? choices.length : lit) - 1,
      )
    } else if (event.key === 'Enter' && open && lit >= 0) {
      event.preventDefault()
      choose(lit)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <FieldLabel htmlFor={id} label={label} note={undefined} />
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && lit >= 0 ? optionId(lit) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        value={text}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => {
          setDismissed(false)
          setActiveIndex(-1)
          onTextChange(event.target.value)
        }}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
        onKeyDown={onKeyDown}
        className={classNames(
          'h-14 w-full rounded-m px-3 text-label text-ink-900 placeholder:text-ink-700',
          'disabled-look',
          invalid
            ? 'border-3 border-brick bg-brick-wash'
            : 'border-2 border-ink-500 bg-paper-50 focus:border-ink-900',
        )}
      />
      <div
        id={listboxId}
        role="listbox"
        aria-label={suggestionsLabel}
        hidden={!open}
        className="mt-0.5 mb-1 rounded-l border-2 border-ink-900 bg-paper-50 p-1.5 shadow-card"
      >
        {busy ? (
          <div className={classNames(OPTION, 'border-transparent font-bold')}>
            <Spinner size={22} />
            {busyText}
          </div>
        ) : (
          choices.map((choice, index) => {
            const isCreate = choice.key === 'create' && create !== undefined
            const active = index === lit
            return (
              // The options are not in the tab order: the keyboard works on the field, which points at
              // the lit option. The press is for the pointer, and must not take the focus from the field.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                key={choice.key}
                id={optionId(index)}
                role="option"
                aria-selected={active}
                tabIndex={-1}
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                onClick={() => {
                  choose(index)
                }}
                className={classNames(
                  OPTION,
                  active ? 'border-ink-900 bg-butter-100' : 'border-transparent',
                  isCreate && 'border-t-dashed mt-1 rounded-t-none border-t-ink-500 font-bold',
                )}
              >
                {isCreate ? (
                  <>
                    <Icon name="plus" size={22} strokeWidth={2.6} />
                    {create.label}
                  </>
                ) : (
                  <span>
                    <Highlighted text={suggestions[index]?.label ?? ''} typed={typed} />
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
