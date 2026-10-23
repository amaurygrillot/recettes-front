import type { ReactNode } from 'react'
import { CardPill } from '../../../../components/CardPill/CardPill'
import { RichTextView } from '../../../../components/RichTextView/RichTextView'
import { WavyRule } from '../../../../components/WavyRule/WavyRule'
import { strings } from '../../strings'
import type { RecipeView } from '../../recipeView'

export interface RecipeHeadingProps {
  recipe: RecipeView
  /** Buttons under the byline: « Modifier » and « Supprimer » on a desktop. */
  actions?: ReactNode
}

/** The title, the categories and tags, who wrote it and when, and the introduction that ends the presentation. */
export function RecipeHeading({ recipe, actions }: RecipeHeadingProps) {
  const { authorName, addedOn, modifiedOn } = recipe
  const addedLine = addedOn === undefined ? undefined : strings.added(addedOn)

  return (
    <div className="flex flex-col gap-3 desktop:gap-4 desktop:pt-1.5">
      <h1 className="font-title text-recipe-title tablet:text-title-display desktop:text-poster">
        {recipe.title}
      </h1>
      {recipe.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe.categories.map((name) => (
            <CardPill key={name} tone="category">
              {name}
            </CardPill>
          ))}
        </div>
      )}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((name) => (
            <CardPill key={name} tone="tag">
              {name}
            </CardPill>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {(authorName !== undefined || addedLine !== undefined) && (
          <p className="text-detail text-ink-800 desktop:text-body">
            {authorName !== undefined && (
              <>
                {strings.byline} <b>{authorName}</b>
              </>
            )}
            {authorName !== undefined && addedLine !== undefined && ' · '}
            {addedLine}
          </p>
        )}
        {modifiedOn !== undefined && (
          <p className="text-caption text-ink-700 desktop:text-detail">
            {strings.modified(modifiedOn)}
          </p>
        )}
      </div>
      {actions}
      {recipe.introduction !== undefined && (
        <div className="flex flex-col gap-4">
          <RichTextView html={recipe.introduction} />
          <WavyRule />
        </div>
      )}
    </div>
  )
}
