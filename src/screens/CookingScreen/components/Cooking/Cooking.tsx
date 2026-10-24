import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '../../../../app/paths'
import type { RecipeView } from '../../../../app/recipeView'
import { Button } from '../../../../components/Button/Button'
import { PhotoViewer } from '../../../../components/PhotoViewer/PhotoViewer'
import { DESKTOP_QUERY, TABLET_QUERY } from '../../../../lib/breakpoints'
import { classNames } from '../../../../lib/classNames'
import { logger } from '../../../../lib/logger'
import { useCanScrollMore } from '../../../../lib/useCanScrollMore'
import { useMediaQuery } from '../../../../lib/useMediaQuery'
import { useSwipe } from '../../../../lib/useSwipe'
import { useWakeLock } from '../../../../lib/useWakeLock'
import { strings } from '../../strings'
import { useCookingProgress } from '../../useCookingProgress'
import { useIngredientChecks } from '../../useIngredientChecks'
import { useStepKeys } from '../../useStepKeys'
import { useSwipeHint } from '../../useSwipeHint'
import { CookingFooter } from '../CookingFooter/CookingFooter'
import { FinishScreen } from '../FinishScreen/FinishScreen'
import {
  IngredientsButton,
  IngredientsPanel,
  IngredientsSheet,
} from '../IngredientsPanels/IngredientsPanels'
import { KeyHints } from '../KeyHints/KeyHints'
import { QuitDialog } from '../QuitDialog/QuitDialog'
import { StepContent } from '../StepContent/StepContent'
import { StepProgress } from '../StepProgress/StepProgress'

export interface CookingProps {
  /** A recipe that has at least one step. */
  recipe: RecipeView
}

/**
 * The step-by-step mode: one step at a time on the whole screen, readable at arm's length, with the
 * ingredients to tick (a sheet on a phone, a panel on a tablet and a desktop) and the way forward and back by
 * the buttons, a swipe or the arrow keys. The screen stays on, the step is remembered on this device, and
 * the end is « Bon appétit ! ».
 */
export function Cooking({ recipe }: CookingProps) {
  const navigate = useNavigate()
  const total = recipe.steps.length
  const progress = useCookingProgress(recipe.id, total)
  const checks = useIngredientChecks(recipe.ingredientGroups)
  const hint = useSwipeHint()
  const tabletOrMore = useMediaQuery(TABLET_QUERY)
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const [quitting, setQuitting] = useState(false)
  const [ingredientsOpen, setIngredientsOpen] = useState(false)
  const [viewing, setViewing] = useState<number | undefined>()
  const reading = useRef<HTMLDivElement>(null)

  useWakeLock(!progress.finished)

  const step = recipe.steps[progress.step - 1]
  const moreBelow = useCanScrollMore(reading, progress.step)

  // A new step is read from its first line.
  useEffect(() => {
    if (reading.current !== null) reading.current.scrollTop = 0
  }, [progress.step])

  function goNext(): void {
    hint.dismiss()
    setViewing(undefined)
    progress.next()
  }
  function goPrevious(): void {
    hint.dismiss()
    setViewing(undefined)
    progress.previous()
  }
  function quit(): void {
    logger.info('The cook left the step-by-step mode', { step: progress.step })
    void navigate(paths.recipe(recipe.id))
  }

  const swipe = useSwipe((direction) => {
    if (direction === 'left') goNext()
    else goPrevious()
  })
  useStepKeys({
    // A sheet, a dialog or a photo that is open has the keys.
    enabled: !quitting && viewing === undefined && (tabletOrMore || !ingredientsOpen),
    onPrevious: goPrevious,
    onNext: goNext,
    onQuit: () => {
      setQuitting(true)
    },
  })

  if (progress.finished) return <FinishScreen recipe={recipe} />
  if (step === undefined) return null

  const progressBlock = <StepProgress step={progress.step} total={total} />
  const ingredientsPanelOpen = tabletOrMore && ingredientsOpen

  return (
    <div className="flex h-dvh bg-paper-100">
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex-none border-b-2 border-paper-300 bg-paper-100 px-4 pt-3.5 pb-3 tablet:px-7 tablet:py-4.5">
          <div className="flex items-center gap-3 tablet:gap-4">
            <Button
              variant="secondary"
              size="medium"
              icon="chevron-left"
              onClick={() => {
                setQuitting(true)
              }}
            >
              {strings.quit}
            </Button>
            <h1 className="line-clamp-2 min-w-0 flex-1 font-title text-title-3 tablet:text-dialog-title">
              {recipe.title}
            </h1>
            {tabletOrMore && (
              <Button
                size="medium"
                icon="cutlery"
                aria-expanded={ingredientsOpen}
                onClick={() => {
                  setIngredientsOpen((open) => !open)
                }}
              >
                {strings.ingredients.title}
                {checks.ready > 0 && (
                  <span className="font-normal text-ink-800">
                    {strings.ingredients.readyInline(checks.ready, checks.total)}
                  </span>
                )}
              </Button>
            )}
          </div>
          {!tabletOrMore && <div className="mt-3">{progressBlock}</div>}
        </header>

        <section
          ref={reading}
          aria-label={total > 1 ? strings.stepOf(progress.step, total) : undefined}
          {...swipe}
          className="relative min-h-0 flex-1 touch-pan-y overflow-y-auto"
        >
          <div
            className={classNames(
              'mx-auto flex max-w-140 flex-col px-4 pt-3.5 pb-4 tablet:px-7 tablet:pt-9 desktop:max-w-170',
              ingredientsPanelOpen && 'tablet:ml-4',
            )}
          >
            {tabletOrMore && <div className="mb-7">{progressBlock}</div>}
            <StepContent
              step={step}
              onOpenPhoto={(position) => {
                setViewing(position)
              }}
            />
          </div>
          <div className="pointer-events-none sticky bottom-0 flex flex-col items-center">
            {hint.visible && !desktop && (
              <p className="mb-3 rounded-pill border-2 border-ink-900 bg-paper-50 px-4 py-2 text-detail font-bold text-ink-900 shadow-paper">
                {strings.swipeHint}
              </p>
            )}
            <div
              aria-hidden="true"
              className={classNames(
                'h-14 w-full bg-linear-to-b from-paper-100/0 to-paper-100 transition-opacity',
                moreBelow ? 'opacity-100' : 'opacity-0',
              )}
            />
          </div>
        </section>

        <CookingFooter
          step={progress.step}
          total={total}
          onPrevious={goPrevious}
          onNext={goNext}
          above={
            tabletOrMore ? undefined : (
              <IngredientsButton
                checks={checks}
                onClick={() => {
                  setIngredientsOpen(true)
                }}
              />
            )
          }
          keyHints={tabletOrMore && desktop ? <KeyHints /> : undefined}
        />
      </main>

      {ingredientsPanelOpen && (
        <IngredientsPanel
          groups={recipe.ingredientGroups}
          checks={checks}
          onClose={() => {
            setIngredientsOpen(false)
          }}
        />
      )}
      {!tabletOrMore && (
        <IngredientsSheet
          open={ingredientsOpen}
          groups={recipe.ingredientGroups}
          checks={checks}
          onClose={() => {
            setIngredientsOpen(false)
          }}
        />
      )}
      <QuitDialog
        open={quitting}
        onStay={() => {
          setQuitting(false)
        }}
        onQuit={quit}
      />
      <PhotoViewer
        photos={step.photos}
        index={viewing}
        onIndexChange={setViewing}
        onClose={() => {
          setViewing(undefined)
        }}
      />
    </div>
  )
}
