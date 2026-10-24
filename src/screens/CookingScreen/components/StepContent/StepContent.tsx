import { RichTextView } from '../../../../components/RichTextView/RichTextView'
import { StepNumber } from '../../../../components/StepNumber/StepNumber'
import { classNames } from '../../../../lib/classNames'
import type { StepView } from '../../../../app/recipeView'
import { strings } from '../../strings'

export interface StepContentProps {
  step: StepView
  /** A photo of the step was touched: the viewer opens on it. */
  onOpenPhoto: (position: number) => void
}

/**
 * What the cook reads: the stamp of the step, its instruction in the biggest text of the app (22/34),
 * then its photos. One photo is a 4:3 frame under the text, several are a row of thumbnails (they do not
 * scroll: sliding is how the step changes); a touch opens the photo at the size of the screen.
 */
export function StepContent({ step, onOpenPhoto }: StepContentProps) {
  const { photos } = step

  return (
    <div className="flex flex-col gap-3.5 tablet:gap-7">
      <div className="flex flex-col gap-3.5 tablet:flex-row tablet:items-start tablet:gap-6">
        <StepNumber number={step.number} word={strings.stamp} />
        <div className="min-w-0 tablet:max-w-140 tablet:pt-1.5">
          <RichTextView html={step.html} size="step" />
        </div>
      </div>
      {photos.length > 0 && (
        <div className="flex gap-2.5">
          {photos.map((photo, position) => (
            <button
              key={photo.id}
              type="button"
              aria-label={
                photos.length === 1
                  ? strings.photo.zoomOne
                  : strings.photo.zoom(position + 1, photos.length)
              }
              onClick={() => {
                onOpenPhoto(position)
              }}
              className={classNames(
                'aspect-4/3 min-w-0 flex-1 cursor-pointer overflow-hidden border-2 border-ink-900 p-0 focus-visible:outline-offset-3',
                photos.length === 1 ? 'rounded-xl' : 'rounded-l',
              )}
            >
              <img
                src={photos.length === 1 ? photo.url : photo.thumbnailUrl}
                alt={photo.alt}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
