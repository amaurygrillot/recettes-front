import { useId, useState, type KeyboardEvent } from 'react'
import { startsAWord } from '../../lib/normalizeText'
import { strings } from './strings'

export interface ComboboxOption {
  id: string
  label: string
  /** Where the option sits, said after it: « Desserts » for « Tartes ». */
  hint?: string | undefined
}

interface UseComboboxOptions {
  options: readonly ComboboxOption[]
  selectedIds: readonly string[]
  onToggle: (option: ComboboxOption) => void
  maxSuggestions: number
}

/**
 * The behaviour of a field that suggests as one types: what to suggest, which suggestion is
 * active, how the keyboard moves through them, and what is announced when one is chosen. A
 * suggestion is never chosen on its own: the reader always validates.
 */
export function useCombobox({
  options,
  selectedIds,
  onToggle,
  maxSuggestions,
}: UseComboboxOptions) {
  const listboxId = useId()
  const [typed, setTyped] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [announcement, setAnnouncement] = useState('')

  const hasText = typed.trim() !== ''
  const suggestions = hasText
    ? options.filter((option) => startsAWord(option.label, typed)).slice(0, maxSuggestions)
    : []
  const open = hasText && !dismissed && suggestions.length > 0
  const hasNoResult = hasText && suggestions.length === 0
  const activeOption = open ? suggestions[activeIndex] : undefined

  function type(text: string): void {
    setTyped(text)
    setDismissed(false)
    setActiveIndex(-1)
    setAnnouncement('')
  }

  function choose(option: ComboboxOption): void {
    const wasSelected = selectedIds.includes(option.id)
    onToggle(option)
    setAnnouncement(wasSelected ? strings.removed(option.label) : strings.added(option.label))
    // Choosing empties the field to add another; removing keeps the list open on what was typed.
    if (!wasSelected) {
      setTyped('')
      setActiveIndex(-1)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const count = suggestions.length
    switch (event.key) {
      case 'ArrowDown':
        if (count === 0) return
        event.preventDefault()
        setDismissed(false)
        setActiveIndex((index) => (index + 1) % count)
        return
      case 'ArrowUp':
        if (count === 0) return
        event.preventDefault()
        setDismissed(false)
        setActiveIndex((index) => (index <= 0 ? count - 1 : index - 1))
        return
      case 'Enter':
        // Validating a suggestion, or pressing Enter on nothing, must not submit a form around the field.
        event.preventDefault()
        if (activeOption !== undefined) choose(activeOption)
        return
      case 'Escape':
        if (open) {
          event.preventDefault()
          event.stopPropagation()
          setDismissed(true)
        } else if (typed !== '') {
          event.preventDefault()
          event.stopPropagation()
          type('')
        }
        return
    }
  }

  return {
    listboxId,
    typed,
    type,
    clear: () => {
      type('')
    },
    suggestions,
    open,
    hasNoResult,
    activeIndex: activeOption === undefined ? -1 : activeIndex,
    announcement,
    choose,
    onKeyDown,
  }
}
