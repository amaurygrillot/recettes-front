import { useId } from 'react'
import { Link } from 'react-router'
import { formatRelativeDate } from '../../../../lib/formatRelativeDate'
import type { RecipeCardModel } from '../../recipeCards'
import { strings } from '../../strings'
import { CardPill } from './CardPill'
import { CoverPhoto } from './CoverPhoto'

export interface RecipeCardProps {
  recipe: RecipeCardModel
}

function byline(recipe: RecipeCardModel): string | undefined {
  const when = recipe.createdAt === undefined ? undefined : formatRelativeDate(recipe.createdAt)
  if (recipe.author !== undefined) return strings.card.byline(recipe.author, when)
  return when
}

/**
 * A recipe of the feed: photo, categories, title, tags, author and date. The whole card is one link
 * with one name, the title; no note, time or difficulty, because the library has none.
 */
export function RecipeCard({ recipe }: RecipeCardProps) {
  const titleId = useId()
  const meta = byline(recipe)

  return (
    <Link
      to={recipe.path}
      aria-labelledby={titleId}
      className="block h-full overflow-hidden rounded-xl border-2 border-ink-900 bg-paper-50 text-ink-900 shadow-card focus-visible:outline-offset-4 active:translate-0.5 active:bg-butter-100 active:shadow-none"
    >
      <CoverPhoto url={recipe.coverUrl} />
      <div className="flex flex-col gap-2.5 px-4.5 pt-3.5 pb-4">
        {recipe.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.categories.map((name) => (
              <CardPill key={name} tone="category">
                {name}
              </CardPill>
            ))}
          </div>
        )}
        <h3 id={titleId} className="line-clamp-2 min-h-15 font-title text-title-3">
          {recipe.title}
        </h3>
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((name) => (
              <CardPill key={name} tone="tag">
                {name}
              </CardPill>
            ))}
            {recipe.hiddenTagCount > 0 && (
              <CardPill tone="overflow">
                <span aria-hidden="true">{strings.card.moreTags(recipe.hiddenTagCount)}</span>
                <span className="sr-only">
                  {strings.card.moreTagsSpoken(recipe.hiddenTagCount)}
                </span>
              </CardPill>
            )}
          </div>
        )}
        {meta !== undefined && <p className="text-detail text-ink-700">{meta}</p>}
      </div>
    </Link>
  )
}
