import { useState } from 'react'
import { useCreateIngredient, useFindIngredient, useIngredientSearch } from '../../api/ingredients'
import type { Suggestion } from '../../components/AutocompleteField/AutocompleteField'
import { logger } from '../../lib/logger'
import { normalizeText } from '../../lib/normalizeText'
import { useDebouncedValue } from '../../lib/useDebouncedValue'
import type { Choice } from './editorModel'
import { LIMITS } from './editorSchema'
import { strings } from './strings'

const { ingredients } = strings

/** How many suggestions are asked for: the field shows few, as the design does, and the typing narrows them. */
const SUGGESTION_COUNT = 6
/** The typing has to pause this long before the back end is asked. */
const SEARCH_AFTER_MS = 200

/** What became of the last attempt to make an ingredient exist: said under the line. */
export type CreationOutcome =
  { kind: 'created' } | { kind: 'existed'; name: string } | { kind: 'failed'; name: string }

export interface IngredientChoiceOptions {
  /** What the form holds for this line. */
  chosen: Choice | null
  onChange: (chosen: Choice | null) => void
}

/**
 * Choosing the ingredient of a line: what is typed, what exists that starts like it, and a last way
 * out when nothing is right, creating it on the spot. Nothing is chosen by the typing alone: the form
 * holds an ingredient only once it was picked from the list or created, and editing the text takes the
 * choice back. Creating an ingredient that someone else created meanwhile (409) picks theirs.
 */
export function useIngredientChoice({ chosen, onChange }: IngredientChoiceOptions) {
  const [text, setText] = useState(chosen?.label ?? '')
  const [outcome, setOutcome] = useState<CreationOutcome | undefined>()
  const createIngredient = useCreateIngredient()
  const findIngredient = useFindIngredient()

  const typed = text.trim()
  const searched = useDebouncedValue(typed, SEARCH_AFTER_MS)
  const search = useIngredientSearch(
    { namePrefix: searched, size: SUGGESTION_COUNT },
    searched !== '',
  )

  const wanted = normalizeText(typed)
  const suggestions: Suggestion[] =
    typed === ''
      ? []
      : (search.data?.content ?? []).flatMap(({ id, name }) =>
          id !== undefined && name !== undefined && normalizeText(name).startsWith(wanted)
            ? [{ id, label: name }]
            : [],
        )
  const exists = suggestions.some(({ label }) => normalizeText(label) === wanted)

  function pick(choice: Choice): void {
    setText(choice.label)
    onChange(choice)
  }

  function create(): void {
    const name = typed
    logger.info('Creating an ingredient')
    setOutcome(undefined)
    createIngredient.mutate(
      { name },
      {
        onSuccess: ({ id, name: created }) => {
          if (id === undefined) {
            setOutcome({ kind: 'failed', name })
            return
          }
          pick({ id, label: created ?? name })
          setOutcome({ kind: 'created' })
        },
        onError: ({ failure }) => {
          if (failure.kind !== 'conflict') {
            setOutcome({ kind: 'failed', name })
            return
          }
          // Someone made it first: no fault, the one that exists is chosen.
          findIngredient(name).then(
            (existing) => {
              if (existing?.id === undefined) {
                setOutcome({ kind: 'failed', name })
                return
              }
              const label = existing.name ?? name
              pick({ id: existing.id, label })
              setOutcome({ kind: 'existed', name: label })
            },
            () => {
              setOutcome({ kind: 'failed', name })
            },
          )
        },
      },
    )
  }

  return {
    text,
    maxLength: LIMITS.ingredientName,
    onTextChange: (next: string) => {
      setText(next)
      setOutcome(undefined)
      if (chosen !== null && next !== chosen.label) onChange(null)
    },
    suggestions,
    onChoose: (suggestion: Suggestion) => {
      setOutcome(undefined)
      pick(suggestion)
    },
    create:
      typed === '' || exists ? undefined : { label: ingredients.create(typed), onCreate: create },
    busyText: createIngredient.isPending ? ingredients.creating(typed) : undefined,
    locked: createIngredient.isPending,
    outcome,
    /** Sends the same creation again, after a failure. */
    retry: create,
  }
}
