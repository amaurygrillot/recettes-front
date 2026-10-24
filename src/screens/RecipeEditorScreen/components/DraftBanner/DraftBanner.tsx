import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface DraftBannerProps {
  /** When the draft was kept, as it is said aloud: « hier à 18 h 42 ». */
  when: string
  onResume: () => void
  onStartOver: () => void
}

const { draft } = strings

/**
 * Offered once, above the first section, when a draft of this recipe waits on the device. It is a
 * remark, not an alert: the stitched frame of the recipe page's tip. It goes away as soon as one of
 * the two answers is chosen.
 */
export function DraftBanner({ when, onResume, onStartOver }: DraftBannerProps) {
  return (
    <section
      aria-labelledby="draft-found-title"
      className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-ink-900 bg-butter-100 p-4"
    >
      <h2 id="draft-found-title" className="font-title text-dialog-title">
        {draft.foundTitle}
      </h2>
      <p className="text-body text-ink-800">{draft.found(when)}</p>
      <div className="flex flex-col gap-3 tablet:flex-row">
        <Button fullWidth onClick={onResume}>
          {draft.resume}
        </Button>
        <Button variant="secondary" fullWidth onClick={onStartOver}>
          {draft.startOver}
        </Button>
      </div>
    </section>
  )
}
