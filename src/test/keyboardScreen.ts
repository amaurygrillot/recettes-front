import { vi } from 'vitest'

export interface KeyboardScreen {
  /** The top of the field, in pixels from the top of the screen. */
  fieldTop: number
  fieldBottom: number
  /** What the person can see: the keyboard covers all that is under this. */
  visibleHeight: number
  /** How tall the list of suggestions is, whatever room it is given. */
  listHeight: number
}

/**
 * Lays a field (the `combobox`) and its list (the `listbox`) on a screen, with a keyboard over its lower part: jsdom
 * has no layout, so the boxes are stated. Remove it with `removeKeyboardScreen`.
 */
export function installKeyboardScreen({
  fieldTop,
  fieldBottom,
  visibleHeight,
  listHeight,
}: KeyboardScreen): void {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const isField = this.getAttribute('role') === 'combobox'
    const top = isField ? fieldTop : 0
    const bottom = isField ? fieldBottom : 0
    return {
      x: 0,
      y: top,
      top,
      bottom,
      left: 0,
      right: 280,
      width: 280,
      height: bottom - top,
      toJSON: () => ({}),
    }
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.getAttribute('role') === 'listbox' ? listHeight : 0
    },
  })
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: {
      offsetTop: 0,
      height: visibleHeight,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  })
}

export function removeKeyboardScreen(): void {
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight')
  Reflect.deleteProperty(window, 'visualViewport')
}
