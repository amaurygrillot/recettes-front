import { useParams } from 'react-router'
import { useRecipe } from '../../api/recipes'
import { useSession } from '../../api/session'
import { failureMessage } from '../../app/failureMessage'
import { canManageRecipe } from '../../app/navigation'
import { paths } from '../../app/paths'
import { useGoBack } from '../../app/useGoBack'
import { Button } from '../../components/Button/Button'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { LoadingRegion } from '../../components/LoadingRegion/LoadingRegion'
import { Skeleton } from '../../components/Skeleton/Skeleton'
import { EditorMessage } from './components/EditorMessage/EditorMessage'
import { EditorRefusal } from './components/EditorRefusal/EditorRefusal'
import { RecipeEditor } from './components/RecipeEditor/RecipeEditor'
import { newRecipeValues, valuesFromRecipe } from './editorModel'
import { useReferencesState, type References } from './references'
import { strings } from './strings'

/** A wait for the vocabulary or the recipe: the shapes of the form, announced as a wait. */
function EditorLoading() {
  return (
    <LoadingRegion label={strings.loading}>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-1/3 rounded-s" />
        <Skeleton className="h-23 w-full rounded-m" />
        <Skeleton className="h-40 w-full rounded-m" />
        <Skeleton className="h-16 w-full rounded-m" />
      </div>
    </LoadingRegion>
  )
}

function EditorFailure({ cause, retry }: { cause: string; retry: () => void }) {
  return (
    <ErrorState title={strings.loadFailed} description={cause} headingLevel={2}>
      <Button icon="refresh" fullWidth onClick={retry}>
        {strings.retry}
      </Button>
    </ErrorState>
  )
}

/** An existing recipe: loaded, and only opened for the people who may change it. */
function RecipeToChange({ id, references }: { id: string; references: References }) {
  const recipe = useRecipe(id)
  const session = useSession()
  const title = strings.titles.edit
  const close = useGoBack(paths.recipe(id))

  if (recipe.isPending) {
    return (
      <EditorMessage title={title} onClose={close}>
        <EditorLoading />
      </EditorMessage>
    )
  }
  if (recipe.isError) {
    const { failure } = recipe.error
    return (
      <EditorMessage title={title} onClose={close}>
        {failure.kind === 'not-found' && <EditorRefusal kind="gone" recipeId={id} />}
        {failure.kind === 'forbidden' && <EditorRefusal kind="forbidden" recipeId={id} />}
        {failure.kind !== 'not-found' && failure.kind !== 'forbidden' && (
          <EditorFailure
            cause={failureMessage(failure)}
            retry={() => {
              void recipe.refetch()
            }}
          />
        )}
      </EditorMessage>
    )
  }
  if (!canManageRecipe(session, recipe.data.author?.id)) {
    return (
      <EditorMessage title={title} onClose={close}>
        <EditorRefusal kind="forbidden" recipeId={id} />
      </EditorMessage>
    )
  }

  return (
    <RecipeEditor
      recipeId={id}
      initial={valuesFromRecipe(recipe.data, references.categoryLabel)}
      references={references}
    />
  )
}

/**
 * `/recettes/nouvelle` and `/recettes/:id/modifier`: the same page to write a recipe or to change
 * one, for a member. The editor opens once the choices a recipe is written from (categories, tags,
 * units) are there, and, to change a recipe, once it is loaded and the member may change it.
 */
export function RecipeEditorScreen() {
  const { id } = useParams()
  const references = useReferencesState()
  const close = useGoBack(id === undefined ? paths.home : paths.recipe(id))
  const title = id === undefined ? strings.titles.create : strings.titles.edit

  if (references.status !== 'ready') {
    return (
      <EditorMessage title={title} onClose={close}>
        {references.status === 'loading' ? (
          <EditorLoading />
        ) : (
          <EditorFailure cause={strings.referencesFailed} retry={references.retry} />
        )}
      </EditorMessage>
    )
  }
  if (id === undefined) {
    return (
      <RecipeEditor
        recipeId={undefined}
        initial={newRecipeValues()}
        references={references.references}
      />
    )
  }
  return <RecipeToChange key={id} id={id} references={references.references} />
}
