import { strings } from '../../strings'

const { keys } = strings

function Key({ label, action }: { label: string; action: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <kbd className="inline-flex h-8 min-w-9 items-center justify-center rounded-s border-thin border-ink-500 bg-paper-50 px-2.5 font-body text-detail font-bold text-ink-900">
        {label}
      </kbd>
      {action}
    </span>
  )
}

/** What the keyboard does, under the buttons, from a tablet on: « ← Précédent », « → Suivant », « Échap Quitter ». Not read out: the buttons say it all. */
export function KeyHints() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex max-w-140 items-center justify-center gap-5.5 pt-3 text-detail text-ink-800 desktop:max-w-170"
    >
      <Key label="←" action={keys.previous} />
      <Key label="→" action={keys.next} />
      <Key label={keys.escape} action={keys.quit} />
    </div>
  )
}
