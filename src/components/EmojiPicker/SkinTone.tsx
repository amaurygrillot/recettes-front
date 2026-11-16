import { useSkinTone, type SkinTone } from 'frimousse'
import { useId, useRef, type RefObject } from 'react'
import { classNames } from '../../lib/classNames'
import { Emoji } from '../Emoji/Emoji'
import { strings } from './strings'

/** The hand that shows the tones: a wave, which has all five. */
const HAND = '👋'

function toneName(tone: SkinTone): string {
  return strings.skinTone.names[tone]
}

export interface SkinToneButtonProps {
  open: boolean
  onToggle: () => void
  /** For whoever puts the focus back on the button once a tone is chosen. */
  buttonRef: RefObject<HTMLButtonElement | null>
}

/** The 56 px button that shows the hand in the tone in force and opens the six tones. */
export function SkinToneButton({ open, onToggle, buttonRef }: SkinToneButtonProps) {
  const [tone, , variations] = useSkinTone(HAND)
  const current = variations.find((variation) => variation.skinTone === tone)?.emoji ?? HAND

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      aria-label={strings.skinTone.change(toneName(tone))}
      onClick={onToggle}
      className="flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-l border-2 border-ink-900 bg-paper-50 enabled:active:bg-butter-200"
    >
      <Emoji emoji={current} size="name" />
    </button>
  )
}

export interface SkinToneChoiceProps {
  /** Called once a tone is chosen, to close the row. */
  onChosen: () => void
}

/** The six tones, as a group of radio buttons: the keyboard moves between them with the arrows. */
export function SkinToneChoice({ onChosen }: SkinToneChoiceProps) {
  const [tone, setTone, variations] = useSkinTone(HAND)
  const name = useId()
  // A touch or a click closes the row, the arrows of a keyboard (which change the tone too) do not. The
  // « click » a browser makes on the radio is the same for both (its `detail` is 0 in WebKit), so the
  // pointer is what tells them apart.
  const byPointer = useRef(false)

  return (
    <div
      role="radiogroup"
      aria-label={strings.skinTone.group}
      className="flex flex-wrap justify-between gap-2"
    >
      {variations.map((variation) => (
        <label
          key={variation.skinTone}
          className="cursor-pointer"
          onPointerDown={() => {
            byPointer.current = true
          }}
        >
          <input
            type="radio"
            name={name}
            checked={variation.skinTone === tone}
            aria-label={strings.skinTone.option(toneName(variation.skinTone))}
            onChange={() => {
              setTone(variation.skinTone)
              if (!byPointer.current) return
              byPointer.current = false
              onChosen()
            }}
            onKeyDown={() => {
              byPointer.current = false
            }}
            className="peer sr-only"
          />
          <span
            className={classNames(
              'flex size-14 items-center justify-center rounded-l border-2 border-ink-500 bg-paper-50',
              'peer-checked:border-ink-900 peer-checked:bg-butter-300 peer-checked:shadow-stamp-xs',
              'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-900',
            )}
          >
            <Emoji emoji={variation.emoji} size="name" />
          </span>
        </label>
      ))}
    </div>
  )
}
