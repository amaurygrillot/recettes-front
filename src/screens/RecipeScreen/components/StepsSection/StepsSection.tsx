import { useState } from 'react'
import { PhotoViewer } from '../../../../components/PhotoViewer/PhotoViewer'
import { RichTextView } from '../../../../components/RichTextView/RichTextView'
import { StepNumber } from '../../../../components/StepNumber/StepNumber'
import { classNames } from '../../../../lib/classNames'
import type { StepView } from '../../../../app/recipeView'
import { strings } from '../../strings'

export interface StepsSectionProps {
  steps: readonly StepView[]
}

/** The photo of a step that is open in the viewer. */
interface OpenPhoto {
  step: number
  photo: number
}

/**
 * The preparation as numbered steps in the 22/34 text of the stove, each with its photos: one
 * shows large, several as a row, and a touch on any opens it at the size of the screen. A recipe
 * without steps says so (« Pas encore d'étapes ») instead of leaving the section mute.
 */
export function StepsSection({ steps }: StepsSectionProps) {
  const [open, setOpen] = useState<OpenPhoto | undefined>()
  const openStep = open === undefined ? undefined : steps.find((step) => step.number === open.step)

  return (
    <section className="flex flex-col gap-0.5">
      <h2 className="font-title text-page-title text-ink-900">{strings.steps.title}</h2>
      {steps.length === 0 ? (
        <div className="flex flex-col gap-1.5 pt-3">
          <h3 className="font-title text-title-3 text-ink-900">{strings.steps.none.title}</h3>
          <p className="text-body text-ink-800">{strings.steps.none.description}</p>
        </div>
      ) : (
        <ol>
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col gap-3.5 border-b border-dashed border-ink-500 pt-5 pb-5.5"
            >
              <StepNumber number={step.number} />
              <div>
                <h3 className="sr-only">{strings.steps.stepLabel(step.number)}</h3>
                <RichTextView html={step.html} size="step" />
                {step.photos.length > 0 && (
                  <div className="mt-4 flex gap-2.5">
                    {step.photos.map((photo, position) => (
                      <button
                        key={photo.id}
                        type="button"
                        aria-label={strings.steps.photo(position + 1, step.photos.length)}
                        onClick={() => {
                          setOpen({ step: step.number, photo: position })
                        }}
                        className={classNames(
                          'aspect-4/3 min-w-0 flex-1 cursor-pointer overflow-hidden border-2 border-ink-900 p-0 focus-visible:outline-offset-3',
                          step.photos.length === 1 ? 'rounded-xl' : 'rounded-l',
                        )}
                      >
                        <img
                          src={step.photos.length === 1 ? photo.url : photo.thumbnailUrl}
                          alt=""
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      <PhotoViewer
        photos={openStep?.photos ?? []}
        index={open?.photo}
        onIndexChange={(photo) => {
          setOpen((current) => (current === undefined ? current : { ...current, photo }))
        }}
        onClose={() => {
          setOpen(undefined)
        }}
      />
    </section>
  )
}
