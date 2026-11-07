import { useId } from 'react'
import { Link } from 'react-router'
import { formatRelativeDate } from '../../lib/formatRelativeDate'
import { CardPill } from '../CardPill/CardPill'
import { CoverArrows } from './CoverArrows'
import { CoverPhoto } from './CoverPhoto'
import { strings } from './strings'
import { useCoverSlider } from './useCoverSlider'

/** What a recipe card shows, resolved by the screen: the card itself knows no URL and no API schema. */
export interface RecipeCardModel {
  id: string
  /** The recipe's page. */
  path: string
  title: string
  /** The thumbnails of the cover pictures, in order; none for a recipe without a photo. */
  coverUrls: readonly string[]
  categories: readonly string[]
  tags: readonly string[]
  /** Tags beyond the ones shown: « +2 ». */
  hiddenTagCount: number
  author: string | undefined
  /** ISO date-time. */
  createdAt: string | undefined
}

export interface RecipeCardProps {
  recipe: RecipeCardModel
}

function byline(recipe: RecipeCardModel): string | undefined {
  const when = recipe.createdAt === undefined ? undefined : formatRelativeDate(recipe.createdAt)
  if (recipe.author !== undefined) return strings.byline(recipe.author, when)
  return when
}

/**
 * A recipe of the feed: photo, categories, title, tags, author and date. The whole card is one link
 * with one name, the title; no note, time or difficulty, because the library has none. With several
 * photos the cover is a small slider (R8): a touch anywhere, on a photo too, still opens the recipe.
 */
export function RecipeCard({ recipe }: RecipeCardProps) {
  const titleId = useId()
  const meta = byline(recipe)
  const slider = useCoverSlider(recipe.coverUrls.length)
  const sliding = recipe.coverUrls.length > 1

  return (
    <div className="group/card relative h-full">
      <Link
        to={recipe.path}
        aria-labelledby={titleId}
        onKeyDown={slider.onKeyDown}
        className="block h-full overflow-hidden rounded-xl border-2 border-ink-900 bg-paper-50 text-ink-900 shadow-card focus-visible:outline-offset-4 active:translate-0.5 active:bg-butter-100 active:shadow-none"
      >
        <CoverPhoto urls={recipe.coverUrls} slider={slider} />
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
                  <span aria-hidden="true">{strings.moreTags(recipe.hiddenTagCount)}</span>
                  <span className="sr-only">{strings.moreTagsSpoken(recipe.hiddenTagCount)}</span>
                </CardPill>
              )}
            </div>
          )}
          {meta !== undefined && <p className="text-detail text-ink-700">{meta}</p>}
        </div>
      </Link>
      {sliding && (
        <>
          <CoverArrows onPrevious={slider.previous} onNext={slider.next} />
          <p role="status" className="sr-only">
            {slider.announcement}
          </p>
        </>
      )}
    </div>
  )
}
