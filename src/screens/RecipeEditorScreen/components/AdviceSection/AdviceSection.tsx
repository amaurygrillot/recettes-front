import { Controller, useFormContext } from 'react-hook-form'
import { RichTextEditor } from '../../../../components/RichTextEditor/RichTextEditor'
import type { EditorValues } from '../../editorModel'
import { useSaving } from '../../savingContext'
import { strings } from '../../strings'
import { EditorSection } from '../EditorSection/EditorSection'

/** Section 5: the cook's tip, one optional field of rich text, in the stitched frame the recipe page shows it in. */
export function AdviceSection() {
  const { control } = useFormContext<EditorValues>()
  const saving = useSaving()

  return (
    <EditorSection id="advice" number={5} title={strings.sections.adviceTitle}>
      <Controller
        control={control}
        name="advice"
        render={({ field }) => (
          <RichTextEditor
            variant="advice"
            label={strings.advice.label}
            note={strings.optional}
            placeholder={strings.advice.placeholder}
            initialHtml={field.value}
            onChange={field.onChange}
            locked={saving}
          />
        )}
      />
    </EditorSection>
  )
}
