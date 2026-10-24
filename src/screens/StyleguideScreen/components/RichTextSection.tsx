import { RichTextEditor } from '../../../components/RichTextEditor/RichTextEditor'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { richText } = strings

/** The editor of the introduction, the steps and the tip, in the states of the `Editeur-texte-riche` board. */
export function RichTextSection() {
  return (
    <StyleguideSection title={richText.title}>
      <div className="grid gap-x-7 gap-y-8 tablet:grid-cols-2">
        <StyleguideSpecimen label={richText.empty}>
          <RichTextEditor
            variant="introduction"
            label={richText.introduction}
            note={richText.optional}
            placeholder={richText.introductionPlaceholder}
            initialHtml=""
            onChange={() => undefined}
          />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={richText.filled}>
          <RichTextEditor
            variant="step"
            label={richText.step}
            placeholder={richText.stepPlaceholder}
            initialHtml={richText.filledHtml}
            onChange={() => undefined}
          />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={richText.error}>
          <RichTextEditor
            variant="step"
            label={richText.step}
            placeholder={richText.stepPlaceholder}
            initialHtml=""
            onChange={() => undefined}
            error={richText.errorMessage}
          />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={richText.advice}>
          <RichTextEditor
            variant="advice"
            label={richText.adviceLabel}
            note={richText.optional}
            placeholder={richText.advicePlaceholder}
            initialHtml=""
            onChange={() => undefined}
            hint={richText.hint}
          />
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
