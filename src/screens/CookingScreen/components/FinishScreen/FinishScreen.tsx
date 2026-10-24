import { paths } from '../../../../app/paths'
import type { RecipeView } from '../../../../app/recipeView'
import { AdviceNote } from '../../../../components/AdviceNote/AdviceNote'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { useFocusOnMount } from '../../../../lib/useFocusOnMount'
import { strings } from '../../strings'

export interface FinishScreenProps {
  recipe: RecipeView
}

const { done } = strings

/** The brick stamp of the end, a little tilted, laid on the photo (or on its own when the recipe has none). */
function BonAppetit() {
  return (
    <div
      aria-hidden="true"
      className="grid size-33 shrink-0 rotate-6 place-items-center rounded-full border-3 border-brick bg-paper-50 text-center font-hand text-annotation leading-none text-brick shadow-[inset_0_0_0_4px_var(--color-paper-50),inset_0_0_0_5.5px_var(--color-brick)]"
    >
      <span>
        {done.stampTop}
        <br />
        {done.stampBottom}
      </span>
    </div>
  )
}

/**
 * The end of the recipe: « Bon appétit ! », the stamp on the photo of the dish, what was cooked, the
 * cook's tip if the recipe has one (no empty frame otherwise), and the two ways out. No confetti.
 */
export function FinishScreen({ recipe }: FinishScreenProps) {
  const title = useFocusOnMount<HTMLHeadingElement>()
  const cover = recipe.photos[0]

  return (
    <main className="flex h-dvh flex-col bg-paper-100">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-7.5 pb-6 tablet:px-8">
        <div className="mx-auto flex max-w-140 flex-col gap-4 desktop:max-w-170">
          <h1 ref={title} tabIndex={-1} className="font-title text-recipe-title outline-none">
            {done.title}
          </h1>
          {cover === undefined ? (
            <div className="flex justify-center py-2">
              <BonAppetit />
            </div>
          ) : (
            <div className="relative">
              <img
                src={cover.url}
                alt={cover.alt}
                className="aspect-4/3 w-full rounded-xl border-2 border-ink-900 object-cover"
              />
              <div className="absolute -top-7.5 right-4">
                <BonAppetit />
              </div>
            </div>
          )}
          <p className="text-body text-ink-800">
            {done.finished(recipe.steps.length, recipe.title)}
          </p>
          {recipe.advice !== undefined && (
            <AdviceNote html={recipe.advice} title={done.tipTitle} label={done.tipLabel} />
          )}
        </div>
      </div>
      <div className="flex-none border-t-2 border-ink-900 bg-paper-50 px-4 pt-3 pb-5.5">
        <div className="mx-auto flex max-w-140 flex-col gap-2.5 desktop:max-w-170">
          <LinkButton to={paths.recipe(recipe.id)} fullWidth>
            {done.backToRecipe}
          </LinkButton>
          <LinkButton to={paths.search} variant="secondary" fullWidth>
            {done.backToRecipes}
          </LinkButton>
        </div>
      </div>
    </main>
  )
}
