import { useEffect } from 'react'
import { Button } from '../../../../components/Button/Button'
import { Icon } from '../../../../components/Icon/Icon'
import { ProgressBar } from '../../../../components/ProgressBar/ProgressBar'
import { useCountdown } from '../../../../lib/useCountdown'
import { canRetry, problemText, type UploadProblem } from '../../photoUpload'
import { strings } from '../../strings'

const { photos } = strings

export interface SendingPhotoTileProps {
  onCancel: () => void
}

/**
 * A picture on its way: it keeps its place in the list, dimmed, with a bar that moves (a browser's
 * request does not say how far it is) and the way to give it up. The rest of the form stays usable.
 */
export function SendingPhotoTile({ onCancel }: SendingPhotoTileProps) {
  return (
    <div
      role="group"
      aria-label={photos.sendingGroup}
      className="flex flex-col overflow-hidden rounded-l border-2 border-ink-900 bg-paper-50"
    >
      <div className="aspect-4/3 border-b-2 border-ink-900 bg-herb-bg opacity-70" />
      <div className="flex flex-1 flex-col gap-2.5 px-2.5 py-3">
        <p className="text-detail font-bold">{photos.sending}</p>
        <ProgressBar label={photos.progress} />
        <div className="mt-auto">
          <Button variant="quiet" size="medium" fullWidth onClick={onCancel}>
            {photos.cancelSend}
          </Button>
        </div>
      </div>
    </div>
  )
}

export interface PhotoProblemTileProps {
  problem: UploadProblem
  onRetry: () => void
  onGiveUp: () => void
}

/**
 * A picture that could not be stored, with its one reason in words (never the colour alone) and
 * what can be done: send it again when that can work, or give it up. When the back end asks to
 * wait, the button says for how long and wakes up by itself.
 */
export function PhotoProblemTile({ problem, onRetry, onGiveUp }: PhotoProblemTileProps) {
  const waitSeconds = problem.kind === 'rate-limited' ? (problem.retryAfterSeconds ?? 0) : 0
  const { remaining, start } = useCountdown(waitSeconds)
  useEffect(() => {
    start()
    // Once per refusal: the countdown restarts when the tile is shown for another one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem])

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2.5 rounded-l border-3 border-brick bg-brick-wash px-2.5 pt-3.5 pb-3 text-center"
    >
      <span className="grid size-12 place-items-center rounded-full border-3 border-brick bg-brick-bg text-brick">
        <Icon name="alert" size={24} strokeWidth={2.4} />
      </span>
      <p className="text-detail font-bold text-brick">{problemText(problem)}</p>
      <div className="mt-auto flex w-full flex-col gap-1.5">
        {canRetry(problem) && (
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            icon={remaining > 0 ? undefined : 'refresh'}
            disabled={remaining > 0}
            onClick={onRetry}
          >
            {remaining > 0 ? photos.retryIn(remaining) : photos.retry}
          </Button>
        )}
        <Button variant="quiet" size="medium" fullWidth onClick={onGiveUp}>
          {photos.giveUp}
        </Button>
      </div>
    </div>
  )
}
