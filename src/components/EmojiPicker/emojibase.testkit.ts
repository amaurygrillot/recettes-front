import { http, HttpResponse } from 'msw'
import { forgetEmojibase } from '../../lib/emoji/emojibase'
import { EMOJIBASE_URL } from '../../lib/emoji/emojiData'
import { server } from '../../test/server'

const files = import.meta.glob('/node_modules/emojibase-data/fr/*.json', {
  eager: true,
  import: 'default',
})

function jsonFile(content: unknown) {
  return new HttpResponse(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json' },
  })
}

/** The app serves the French emoji data itself: the tests serve the package's own files, and start from nothing loaded. */
export function serveEmojibase(): void {
  forgetEmojibase()
  server.use(
    http.get(`${EMOJIBASE_URL}/fr/data.json`, () =>
      jsonFile(files['/node_modules/emojibase-data/fr/data.json']),
    ),
    http.get(`${EMOJIBASE_URL}/fr/messages.json`, () =>
      jsonFile(files['/node_modules/emojibase-data/fr/messages.json']),
    ),
  )
}

type Measure = (element: HTMLElement) => number | undefined

/**
 * jsdom has no layout, and the picker draws only the rows it can see, measured on its own sizing
 * elements: this gives them the sizes the design gives them (a 56 px row, a 40 px title, a viewport
 * of `viewportHeight`), and the picker `width`. Answers what puts the prototypes back.
 */
export function stubPickerLayout({ width = 336, viewportHeight = 448 } = {}): () => void {
  const heights: Measure = (element) => {
    if (element.hasAttribute('frimousse-row-sizer')) return 56
    if (element.hasAttribute('frimousse-category-header-sizer')) return 40
    if (element.hasAttribute('frimousse-viewport')) return viewportHeight
    return undefined
  }
  const widths: Measure = (element) =>
    element.hasAttribute('frimousse-root') || element.hasAttribute('frimousse-viewport')
      ? width
      : undefined
  const originals = ['clientHeight', 'clientWidth', 'offsetWidth'].map(
    (name) => [name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name)] as const,
  )
  const measures: Record<string, Measure> = {
    clientHeight: heights,
    clientWidth: widths,
    offsetWidth: widths,
  }
  for (const [name] of originals) {
    Object.defineProperty(HTMLElement.prototype, name, {
      configurable: true,
      get(this: HTMLElement) {
        return measures[name]?.(this) ?? 0
      },
    })
  }
  return () => {
    for (const [name, original] of originals) {
      if (original === undefined) Reflect.deleteProperty(HTMLElement.prototype, name)
      else Object.defineProperty(HTMLElement.prototype, name, original)
    }
  }
}
