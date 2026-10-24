import { FormProvider } from 'react-hook-form'
import { Button } from '../../../../components/Button/Button'
import { useActiveSection } from '../../../../lib/useActiveSection'
import { formatWhen } from '../../../../lib/formatWhen'
import { goToProblem } from '../../goToProblem'
import type { SectionId } from '../../problems'
import { ReferencesContext, type References } from '../../references'
import { strings } from '../../strings'
import type { EditorValues } from '../../editorModel'
import { SavingContext } from '../../savingContext'
import { UploadTrackerContext } from '../../uploadTracker'
import { useRecipeEditor } from '../../useRecipeEditor'
import { DeleteRecipeSection } from '../DeleteRecipeSection/DeleteRecipeSection'
import { DiscardDraftDialog } from '../DiscardDraftDialog/DiscardDraftDialog'
import { DraftBanner } from '../DraftBanner/DraftBanner'
import { EditorFrame } from '../EditorFrame/EditorFrame'
import { EditorIndex } from '../EditorIndex/EditorIndex'
import { EditorMessage } from '../EditorMessage/EditorMessage'
import { EditorRefusal } from '../EditorRefusal/EditorRefusal'
import { AdviceSection } from '../AdviceSection/AdviceSection'
import { InformationSection } from '../InformationSection/InformationSection'
import { IngredientsSection } from '../IngredientsSection/IngredientsSection'
import { LeaveDialog } from '../LeaveDialog/LeaveDialog'
import { PhotosSection } from '../PhotosSection/PhotosSection'
import { StepsSection } from '../StepsSection/StepsSection'
import { ProblemSummary } from '../ProblemSummary/ProblemSummary'

export interface RecipeEditorProps {
  /** The recipe being changed, or nothing for a new one. */
  recipeId: string | undefined
  /** What the form starts with: blank, or the recipe as it is stored. */
  initial: EditorValues
  references: References
}

const SECTION_IDS: readonly SectionId[] = [
  'informations',
  'photos',
  'ingredients',
  'steps',
  'advice',
]

/**
 * Writing a recipe, new or existing: the sections of the form between a fixed top (the cross, the
 * title, the draft) and a fixed bottom (cancel, save). Nothing the person wrote is lost to a
 * failure, a lost session or a wrong tap on the cross.
 */
export function RecipeEditor({ recipeId, initial, references }: RecipeEditorProps) {
  const editor = useRecipeEditor({ recipeId, initial })
  const { active, select } = useActiveSection(SECTION_IDS)
  const title = recipeId === undefined ? strings.titles.create : strings.titles.edit

  function goTo(id: string): void {
    select(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (editor.refusal !== undefined) {
    return (
      <EditorMessage title={title} onClose={editor.close}>
        <EditorRefusal kind={editor.refusal} recipeId={recipeId} />
      </EditorMessage>
    )
  }

  return (
    <ReferencesContext value={references}>
      <SavingContext value={editor.pending}>
        <UploadTrackerContext value={editor.uploadTracker}>
          <FormProvider {...editor.form}>
            <EditorFrame
              title={title}
              onClose={editor.close}
              draft={editor.draftState}
              banner={
                editor.problems.length > 0 && (
                  <ProblemSummary
                    problems={editor.problems}
                    onGoTo={({ anchor }) => {
                      goToProblem(anchor)
                    }}
                  />
                )
              }
              index={
                <EditorIndex activeId={active} problems={editor.problemCounts} onSelect={goTo} />
              }
              actions={
                <>
                  <Button variant="secondary" disabled={editor.pending} onClick={editor.close}>
                    {strings.cancel}
                  </Button>
                  <Button
                    busy={editor.pending}
                    onClick={() => {
                      void editor.submit()
                    }}
                  >
                    {editor.pending ? strings.saving : strings.save}
                  </Button>
                </>
              }
            >
              {editor.offer.offer !== undefined && (
                <DraftBanner
                  when={formatWhen(new Date(editor.offer.offer.savedAt), new Date())}
                  onResume={editor.offer.resume}
                  onStartOver={editor.offer.askToStartOver}
                />
              )}
              {/* No submit button in it: « Entrée » ends the line of a field, and only « Enregistrer » sends the recipe. */}
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault()
                }}
                className="contents"
              >
                {/* Everything is locked while the recipe is on its way: it cannot be changed under the request. */}
                <fieldset disabled={editor.pending} key={editor.version} className="contents">
                  <InformationSection />
                  <PhotosSection />
                  <IngredientsSection />
                  <StepsSection />
                  <AdviceSection />
                </fieldset>
              </form>
              {recipeId !== undefined && (
                <DeleteRecipeSection recipeId={recipeId} recipeTitle={initial.title} />
              )}
            </EditorFrame>
            <LeaveDialog
              open={editor.guard.blocked}
              onStay={editor.guard.stay}
              onLeave={editor.guard.leave}
            />
            <DiscardDraftDialog
              open={editor.offer.confirming}
              onKeep={editor.offer.keep}
              onDiscard={editor.offer.startOver}
            />
          </FormProvider>
        </UploadTrackerContext>
      </SavingContext>
    </ReferencesContext>
  )
}
