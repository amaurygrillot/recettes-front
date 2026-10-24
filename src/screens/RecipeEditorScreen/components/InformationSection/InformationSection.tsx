import { useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ChoiceField } from '../../../../components/ChoiceField/ChoiceField'
import { RichTextEditor } from '../../../../components/RichTextEditor/RichTextEditor'
import { TextArea } from '../../../../components/TextArea/TextArea'
import type { EditorValues } from '../../editorModel'
import { LIMITS } from '../../editorSchema'
import { messageOf } from '../../fieldError'
import { useReferences } from '../../references'
import { useSaving } from '../../savingContext'
import { strings } from '../../strings'
import { CategorySheet } from '../CategorySheet/CategorySheet'
import { EditorSection } from '../EditorSection/EditorSection'
import { TagSheet } from '../TagSheet/TagSheet'

const { information, choice } = strings

type Sheet = 'categories' | 'tags'

/** Section 1: the title, the introduction, and the categories and tags to choose among those that exist. */
export function InformationSection() {
  const { control, register, formState } = useFormContext<EditorValues>()
  const references = useReferences()
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const saving = useSaving()
  const typedTitle = useWatch({ control, name: 'title' }).length

  return (
    <EditorSection id="informations" number={1} title={strings.sections.information}>
      <TextArea
        label={information.title}
        placeholder={information.titlePlaceholder}
        counter={{ typed: typedTitle, max: LIMITS.title }}
        error={messageOf(formState.errors.title)}
        disabled={formState.isSubmitting}
        {...register('title')}
      />
      <Controller
        control={control}
        name="introduction"
        render={({ field }) => (
          <RichTextEditor
            variant="introduction"
            label={information.introduction}
            note={strings.optional}
            placeholder={information.introductionPlaceholder}
            initialHtml={field.value}
            onChange={field.onChange}
            locked={saving}
          />
        )}
      />
      <Controller
        control={control}
        name="categories"
        render={({ field, fieldState }) => (
          <>
            <div id="categories">
              <ChoiceField
                label={choice.category.field}
                items={field.value}
                chooseLabel={choice.category.choose}
                addLabel={choice.category.add}
                removeLabel={choice.category.remove}
                onRemove={(id) => {
                  field.onChange(field.value.filter((item) => item.id !== id))
                }}
                onOpen={() => {
                  setSheet('categories')
                }}
                hint={information.categoriesHint}
                error={messageOf(fieldState.error)}
              />
            </div>
            {sheet === 'categories' && (
              <CategorySheet
                categories={references.categories}
                chosen={field.value}
                onApply={(chosen) => {
                  field.onChange(chosen)
                  setSheet(null)
                }}
                onClose={() => {
                  setSheet(null)
                }}
              />
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="tags"
        render={({ field }) => (
          <>
            <ChoiceField
              label={choice.tag.field}
              note={strings.optional}
              items={field.value}
              chooseLabel={choice.tag.choose}
              addLabel={choice.tag.add}
              removeLabel={choice.tag.remove}
              onRemove={(id) => {
                field.onChange(field.value.filter((item) => item.id !== id))
              }}
              onOpen={() => {
                setSheet('tags')
              }}
            />
            {sheet === 'tags' && (
              <TagSheet
                tags={references.tags}
                chosen={field.value}
                onApply={(chosen) => {
                  field.onChange(chosen)
                  setSheet(null)
                }}
                onClose={() => {
                  setSheet(null)
                }}
              />
            )}
          </>
        )}
      />
    </EditorSection>
  )
}
