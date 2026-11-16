import { useCallback, useEffect, useState } from 'react'
import type { EmojiData } from 'frimousse'
import { parseEmojiData } from '../../lib/emoji/emojiData'
import { loadEmojibase } from '../../lib/emoji/emojibase'
import { strings } from './strings'

/** The title of a category, under the name of the boards (an unknown group keeps the data's own key). */
function categoryTitle(groupKey: string): string {
  return (
    Object.entries(strings.categories.labels).find(([key]) => key === groupKey)?.[1] ?? groupKey
  )
}

export type PickerData =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; data: EmojiData }

/**
 * The emojis the picker offers, loaded when it opens (not before) from the files the app serves.
 * A load that failed (the connection is gone) can be asked again with `retry`.
 */
export function usePickerData(): { state: PickerData; retry: () => void } {
  const [state, setState] = useState<PickerData>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let current = true
    loadEmojibase().then(
      (raw) => {
        if (current) setState({ status: 'ready', data: parseEmojiData(raw, categoryTitle) })
      },
      () => {
        if (current) setState({ status: 'failed' })
      },
    )
    return () => {
      current = false
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((count) => count + 1)
  }, [])

  return { state, retry }
}
