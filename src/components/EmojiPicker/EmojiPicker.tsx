import { EmojiPicker as Picker, type EmojiData } from 'frimousse'
import { useCallback, useMemo, useRef, useState } from 'react'
import { countEmojisFound } from '../../lib/emoji/emojiSearch'
import { useDebouncedValue } from '../../lib/useDebouncedValue'
import { Button } from '../Button/Button'
import { EmptyState } from '../EmptyState/EmptyState'
import { ErrorBanner } from '../ErrorBanner/ErrorBanner'
import { Mascot } from '../Mascot/Mascot'
import { Spinner } from '../Spinner/Spinner'
import { CategoryPills } from './CategoryPills'
import { EmojiGrid } from './EmojiGrid'
import { usePickerData } from './pickerData'
import { SearchField } from './SearchField'
import { SkinToneButton, SkinToneChoice } from './SkinTone'
import { strings } from './strings'
import { useCategoryNavigation } from './useCategoryNavigation'
import { useColumns } from './useColumns'

export interface EmojiPickerProps {
  /** The emoji in force: the list opens on its category. */
  selected?: string | undefined
  onSelect: (emoji: string) => void
}

interface LoadedPickerProps extends EmojiPickerProps {
  data: EmojiData
}

function LoadedPicker({ data, selected, onSelect }: LoadedPickerProps) {
  const [search, setSearch] = useState('')
  const [tonesOpen, setTonesOpen] = useState(false)
  const toneButtonRef = useRef<HTMLButtonElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const columns = useColumns(rootRef)
  const { active, onScroll, goTo } = useCategoryNavigation(data, columns, viewportRef, selected)
  // The data is already here: the picker is given it as it is, and loads nothing itself.
  const resolveEmojiData = useCallback(() => data, [data])
  const word = useDebouncedValue(search.trim(), 400)
  const searching = search.trim() !== ''
  const pills = useMemo(() => pillsOf(data), [data])

  return (
    <Picker.Root
      ref={rootRef}
      locale="fr"
      columns={columns}
      resolveEmojiData={resolveEmojiData}
      onEmojiSelect={({ emoji }) => {
        onSelect(emoji)
      }}
      className="flex min-h-0 flex-1 flex-col gap-3"
    >
      <div className="flex items-start gap-2.5">
        <SearchField value={search} onChange={setSearch} />
        <SkinToneButton
          buttonRef={toneButtonRef}
          open={tonesOpen}
          onToggle={() => {
            setTonesOpen((open) => !open)
          }}
        />
      </div>
      {tonesOpen && (
        <SkinToneChoice
          onChosen={() => {
            setTonesOpen(false)
            toneButtonRef.current?.focus()
          }}
        />
      )}
      {!searching && <CategoryPills categories={pills} active={active} onGo={goTo} />}
      <p role="status" className="sr-only">
        {word === '' ? '' : strings.results(countEmojisFound(data.emojis, word), word)}
      </p>
      <Picker.Viewport
        ref={viewportRef}
        onScroll={(event) => {
          onScroll(event.currentTarget)
        }}
        className="min-h-0 flex-1 focus-visible:outline-3 focus-visible:outline-ink-900"
      >
        <Picker.Loading>
          <span className="flex justify-center py-8 text-ink-800">
            <Spinner />
          </span>
        </Picker.Loading>
        <Picker.Empty className="block py-4">
          {({ search: typed }) => (
            <EmptyState
              size="compact"
              illustration={<Mascot mood="lost" size="medium" />}
              title={strings.empty.title(typed.trim())}
              description={strings.empty.description}
            />
          )}
        </Picker.Empty>
        <EmojiGrid columns={columns} />
      </Picker.Viewport>
    </Picker.Root>
  )
}

function pillsOf(data: EmojiData) {
  return data.categories.filter((category) =>
    data.emojis.some((emoji) => emoji.category === category.index),
  )
}

/**
 * The emoji picker: a search in French, a skin tone, shortcuts to the nine categories and one long
 * list of emojis drawn by Twemoji (Frimousse does the list, the keyboard and the search; the data is
 * the app's own, capped at the Emoji version the drawings cover). It fills the height it is given and
 * the list scrolls inside. It loads its data when it is shown, and says so when that fails.
 */
export function EmojiPicker(props: EmojiPickerProps) {
  const { state, retry } = usePickerData()

  if (state.status === 'loading') {
    return (
      <p
        role="status"
        className="flex items-center justify-center gap-3 py-8 text-body text-ink-800"
      >
        <Spinner />
        {strings.loading}
      </p>
    )
  }
  if (state.status === 'failed') {
    return (
      <ErrorBanner message={strings.failure.message}>
        <Button variant="secondary" onClick={retry}>
          {strings.failure.retry}
        </Button>
      </ErrorBanner>
    )
  }
  return <LoadedPicker {...props} data={state.data} />
}
