import { Icon } from '../Icon/Icon'
import { strings } from './strings'

export type ToastTone = 'success' | 'error'

export interface ToastProps {
  tone: ToastTone
  /** What happened, in a few words: « Profil mis à jour », « Enregistrement impossible. » */
  message: string
  /** Why, when it failed: a second, quieter line. */
  detail?: string | undefined
  /** An action in yellow, typically « Réessayer ». */
  action?: { label: string; onAction: () => void } | undefined
  onClose: () => void
}

/**
 * A notification on ink: a ticked green dot for what worked (announced politely, it goes away by
 * itself), and for what failed an alert with its action and a cross (announced at once, it stays
 * until it is dealt with: nothing typed is ever lost behind it).
 */
export function Toast({ tone, message, detail, action, onClose }: ToastProps) {
  const failed = tone === 'error'

  return (
    <div
      role={failed ? 'alert' : 'status'}
      className="flex items-center gap-3 rounded-l border-2 border-ink-900 bg-ink-900 py-3 pr-2 pl-4 text-paper-50 shadow-sheet"
    >
      {!failed && (
        <span
          aria-hidden="true"
          className="grid size-7 shrink-0 place-items-center rounded-full bg-herb text-paper-50"
        >
          <Icon name="check" size={18} strokeWidth={3} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-body font-bold">{message}</p>
        {detail && <p className="text-detail text-paper-300">{detail}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onAction}
          className="min-h-12 shrink-0 cursor-pointer rounded-m px-3 text-label font-bold text-butter-300 underline decoration-2 underline-offset-4 focus-visible:outline-butter-300 enabled:hover:bg-ink-800"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        aria-label={strings.close}
        onClick={onClose}
        className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-m text-paper-50 focus-visible:outline-butter-300 enabled:hover:bg-ink-800"
      >
        <Icon name="close" size={22} strokeWidth={2.4} />
      </button>
    </div>
  )
}
