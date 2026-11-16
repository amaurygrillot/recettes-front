import { useEffect, useState } from 'react'
import { logger } from '../logger'
import { EMOJIBASE_URL, readEmojibase, type RawEmoji, type RawEmojibase } from './emojiData'

let loading: Promise<RawEmojibase> | undefined

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${EMOJIBASE_URL}/fr/${path}`)
  if (!response.ok) {
    throw new Error(`The emoji data could not be loaded (${response.status.toString()})`)
  }
  return response.json()
}

/**
 * The French emoji data, loaded once and only when something needs it (the picker opening, the
 * name of an emoji). It is served by the app itself: nothing is asked of another host. A failure is
 * forgotten, so that the next ask tries again.
 */
export function loadEmojibase(): Promise<RawEmojibase> {
  loading ??= Promise.all([fetchJson('data.json'), fetchJson('messages.json')])
    .then(([emojis, messages]) => readEmojibase(emojis, messages))
    .catch((error: unknown) => {
      loading = undefined
      logger.warn('The emoji data could not be loaded')
      throw error
    })
  return loading
}

/** Forgets what was loaded: for the tests, which each start from nothing. */
export function forgetEmojibase(): void {
  loading = undefined
  names = undefined
}

/** How an emoji is looked up: without the selectors that only choose between its text and its picture. */
function nameKey(emoji: string): string {
  return emoji.replace(/[\u{FE0E}\u{FE0F}]/gu, '')
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** The French name of every emoji of the data, each skin tone included (« Pouce vers le haut : peau claire »). */
export function emojiNamesOf(emojis: readonly RawEmoji[]): ReadonlyMap<string, string> {
  const result = new Map<string, string>()
  for (const emoji of emojis) {
    result.set(nameKey(emoji.emoji), capitalize(emoji.label))
    for (const skin of emoji.skins ?? []) result.set(nameKey(skin.emoji), capitalize(skin.label))
  }
  return result
}

let names: Promise<ReadonlyMap<string, string>> | undefined

function loadNames(): Promise<ReadonlyMap<string, string>> {
  names ??= loadEmojibase().then(({ emojis }) => emojiNamesOf(emojis))
  return names
}

/**
 * The name of an emoji in French, for the places that say it out loud (« Émoji : Sapin de Noël,
 * changer »). It comes from the same data as the picker, loaded the first time it is needed:
 * until then, and for an emoji the data does not know, there is no name.
 */
export function useEmojiName(emoji: string): string | undefined {
  const [known, setKnown] = useState<ReadonlyMap<string, string> | undefined>(undefined)

  useEffect(() => {
    let current = true
    loadNames().then(
      (all) => {
        if (current) setKnown(all)
      },
      () => undefined,
    )
    return () => {
      current = false
    }
  }, [])

  return known?.get(nameKey(emoji))
}
