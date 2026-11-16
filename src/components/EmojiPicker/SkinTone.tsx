import { useSkinTone, type SkinTone } from 'frimousse'
import { useId } from 'react'
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
}

/** The 56 px button that shows the hand in the tone in force and opens the six tones. */
export function SkinToneButton({ open, onToggle }: SkinToneButtonProps) {
  const [tone, , variations] = useSkinTone(HAND)
  const current = variations.find((variation) => variation.skinTone === tone)?.emoji ?? HAND

  return (
    <button
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

  return (
    <div
      role="radiogroup"
      aria-label={strings.skinTone.group}
      className="flex flex-wrap justify-between gap-2"
    >
      {variations.map((variation) => (
        <label key={variation.skinTone} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={variation.skinTone === tone}
            aria-label={strings.skinTone.option(toneName(variation.skinTone))}
            onChange={() => {
              setTone(variation.skinTone)
            }}
            // A touch or a click closes the row; the arrows of the keyboard (which also click, with no
            // pointer) move from tone to tone and leave it open.
            onClick={(event) => {
              if (event.detail > 0) onChosen()
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
