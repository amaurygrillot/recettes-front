import { Logo } from '../../../components/Logo/Logo'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const BOWL_SIZES = [72, 48, 32, 24] as const

export function LogoSection() {
  return (
    <StyleguideSection title={strings.logo.title}>
      <div className="flex flex-wrap items-end gap-8">
        <StyleguideSpecimen label={strings.logo.seal}>
          <Logo variant="seal" size={160} />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={strings.logo.sealOnButter}>
          <div className="rounded-l border-2 border-ink-900 bg-butter-300 p-4">
            <Logo variant="seal" tone="on-butter" size={160} />
          </div>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={strings.logo.sealMono}>
          <Logo variant="seal" tone="mono" size={160} />
        </StyleguideSpecimen>
      </div>
      <div className="flex flex-wrap items-end gap-8">
        <StyleguideSpecimen label={strings.logo.lockup}>
          <Logo variant="lockup" size={43} />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={strings.logo.bowl}>
          <div className="flex items-end gap-4">
            {BOWL_SIZES.map((size) => (
              <Logo key={size} variant="bowl" size={size} />
            ))}
          </div>
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
