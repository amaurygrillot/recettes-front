import { Icon } from '../../../../components/Icon/Icon'
import { Spinner } from '../../../../components/Spinner/Spinner'
import { strings } from '../../strings'

/** `idle`: nothing was changed yet, so nothing is promised. */
export type DraftState = 'idle' | 'saving' | 'saved' | 'failed'

export interface DraftStatusProps {
  state: DraftState
}

const { draft } = strings

/**
 * Says what became of the draft: being kept on this device, kept, or not kept. The status is
 * always on the page (and empty until the first change), so that a screen reader announces it when
 * it first speaks; the state is a symbol and words, never the colour alone.
 */
export function DraftStatus({ state }: DraftStatusProps) {
  return (
    <div role="status" className="flex min-h-6 items-center gap-2 text-detail text-ink-800">
      {state === 'saving' && (
        <>
          <Spinner size={18} />
          {draft.saving}
        </>
      )}
      {state === 'saved' && (
        <>
          <span className="text-herb">
            <Icon name="check-circle" size={20} strokeWidth={2.4} />
          </span>
          {draft.saved}
        </>
      )}
      {state === 'failed' && (
        <>
          <span className="text-brick">
            <Icon name="alert" size={20} strokeWidth={2.4} />
          </span>
          {draft.failed}
        </>
      )}
    </div>
  )
}
