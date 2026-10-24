import { paths } from '../../../../app/paths'
import { BowlIllustration } from '../../../../components/BowlIllustration/BowlIllustration'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { ErrorState } from '../../../../components/ErrorState/ErrorState'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { strings } from '../../strings'

export type EditorRefusalKind = 'forbidden' | 'gone'

export interface EditorRefusalProps {
  kind: EditorRefusalKind
  /** The recipe that cannot be changed: `forbidden` leads back to reading it. */
  recipeId: string | undefined
}

/**
 * Instead of a form that could not be saved: the person may not change this recipe (a padlock,
 * and the way back to reading it), or it is not there any more (the empty bowl, a finding rather
 * than a fault). One cause, one message, one main way out.
 */
export function EditorRefusal({ kind, recipeId }: EditorRefusalProps) {
  if (kind === 'forbidden') {
    const { forbidden } = strings
    return (
      <ErrorState icon="lock" title={forbidden.title} description={forbidden.text} headingLevel={2}>
        {recipeId !== undefined && (
          <LinkButton to={paths.recipe(recipeId)} fullWidth>
            {forbidden.toRecipe}
          </LinkButton>
        )}
        <LinkButton to={paths.search} variant="secondary" fullWidth>
          {forbidden.toRecipes}
        </LinkButton>
      </ErrorState>
    )
  }

  const { gone } = strings
  return (
    <EmptyState
      illustration={<BowlIllustration variant="no-result" size="compact" />}
      title={gone.title}
      description={gone.text}
      size="compact"
      headingLevel={2}
    >
      <LinkButton to={paths.search} fullWidth>
        {gone.toRecipes}
      </LinkButton>
      <LinkButton to={paths.home} variant="secondary" fullWidth>
        {gone.toHome}
      </LinkButton>
    </EmptyState>
  )
}
