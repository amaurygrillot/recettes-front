import { useId, useState } from 'react'
import type { SortKey } from '../../../../app/searchCriteria'
import { BottomSheet } from '../../../../components/BottomSheet/BottomSheet'
import { Icon } from '../../../../components/Icon/Icon'
import { RadioRow } from '../../../../components/RadioRow/RadioRow'
import { strings } from '../../strings'

const SORT_KEYS: readonly SortKey[] = ['recent', 'modified', 'title-asc', 'title-desc']

export interface SortControlProps {
  value: SortKey
  onChange: (sort: SortKey) => void
  /** From 1024 px the list is the browser's own, under the button; below, a sheet of radio buttons. */
  asList: boolean
}

function isSortKey(value: string): value is SortKey {
  return SORT_KEYS.some((key) => key === value)
}

/** « Trier : Plus récentes ⌄ »: opens the four orders, in a sheet on a phone and as a list on a desktop. */
export function SortControl({ value, onChange, asList }: SortControlProps) {
  const [open, setOpen] = useState(false)
  const selectId = useId()
  const label = strings.sort.options[value]

  if (asList) {
    return (
      <label
        htmlFor={selectId}
        className="relative inline-flex h-14 items-center gap-1.5 rounded-m border-2 border-transparent px-2.5 text-body font-bold text-ink-900 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-ink-900"
      >
        <span className="font-normal text-ink-800">{strings.sort.prefix}</span>{' '}
        <select
          id={selectId}
          value={value}
          onChange={(event) => {
            if (isSortKey(event.target.value)) onChange(event.target.value)
          }}
          className="cursor-pointer appearance-none bg-transparent pr-7 font-bold outline-none"
        >
          {SORT_KEYS.map((key) => (
            <option key={key} value={key}>
              {strings.sort.options[key]}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2">
          <Icon name="chevron-down" size={22} strokeWidth={2.6} />
        </span>
      </label>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen(true)
        }}
        className="inline-flex h-14 shrink-0 cursor-pointer items-center gap-1.5 rounded-m border-2 border-transparent pr-1.5 pl-2.5 text-body font-bold whitespace-nowrap text-ink-900 focus-visible:outline-offset-3 active:bg-paper-200"
      >
        <span className="font-normal text-ink-800">{strings.sort.prefix}</span> {label}
        <Icon name="chevron-down" size={22} strokeWidth={2.6} />
      </button>
      <BottomSheet open={open} onOpenChange={setOpen} title={strings.sort.title}>
        <fieldset className="pb-2">
          <legend className="sr-only">{strings.sort.legend}</legend>
          {SORT_KEYS.map((key) => (
            <RadioRow
              key={key}
              name="sort"
              value={key}
              label={strings.sort.options[key]}
              checked={value === key}
              // A touch on a row applies it and closes the sheet: there is nothing else to decide.
              onChange={() => {
                onChange(key)
                setOpen(false)
              }}
            />
          ))}
        </fieldset>
      </BottomSheet>
    </>
  )
}
