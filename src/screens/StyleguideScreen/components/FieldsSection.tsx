import { TextField } from '../../../components/TextField/TextField'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { fields } = strings

export function FieldsSection() {
  return (
    <StyleguideSection title={fields.title}>
      <div className="grid gap-x-7 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-3">
        <StyleguideSpecimen label={fields.rest}>
          <TextField
            label={fields.recipeTitle}
            placeholder={fields.placeholder}
            hint={fields.hint}
          />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={fields.filled}>
          <TextField
            label={fields.recipeTitle}
            defaultValue={fields.filledValue}
            hint={fields.hint}
          />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={fields.error}>
          <TextField label={fields.recipeTitle} error={fields.errorMessage} />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={fields.success}>
          <TextField
            label={fields.email}
            type="email"
            defaultValue={fields.emailValue}
            success={fields.successMessage}
          />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={fields.disabled}>
          <TextField
            label={fields.author}
            defaultValue={fields.authorValue}
            hint={fields.authorHint}
            disabled
          />
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
