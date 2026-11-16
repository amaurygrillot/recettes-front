import { strings } from './strings'

/**
 * The line that credits the drawings of the emojis (Twemoji, CC-BY 4.0). It lives at the foot of the
 * Compte page: there is no « À propos » page to hold it.
 */
export function EmojiCredit() {
  return (
    <p className="mt-1.5 text-center text-detail leading-6 text-ink-700">
      {strings.before}
      <b className="text-ink-900">{strings.name}</b>
      {strings.after}
    </p>
  )
}
