import { Button } from '../../../components/Button/Button'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { buttons } = strings

const KINDS = [
  { variant: 'primary', caption: buttons.primary, label: buttons.cook },
  { variant: 'secondary', caption: buttons.secondary, label: buttons.save },
  { variant: 'quiet', caption: buttons.quiet, label: buttons.cancel },
  { variant: 'danger', caption: buttons.danger, label: buttons.delete },
] as const

export function ButtonsSection() {
  return (
    <StyleguideSection title={buttons.title}>
      <div className="grid gap-x-6 gap-y-8 tablet:grid-cols-2">
        {KINDS.map(({ variant, caption, label }) => (
          <StyleguideSpecimen key={variant} label={caption}>
            <Button variant={variant} fullWidth>
              {label}
            </Button>
            <Button variant={variant} fullWidth disabled>
              {label}
            </Button>
          </StyleguideSpecimen>
        ))}
        <StyleguideSpecimen label={buttons.medium}>
          <Button size="medium" fullWidth>
            {buttons.save}
          </Button>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={buttons.withIcon}>
          <Button icon="chef-hat" fullWidth>
            {buttons.longLabel}
          </Button>
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
