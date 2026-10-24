import { AvatarsSection } from './components/AvatarsSection'
import { ButtonsSection } from './components/ButtonsSection'
import { FieldsSection } from './components/FieldsSection'
import { RichTextSection } from './components/RichTextSection'
import { IconsSection } from './components/IconsSection'
import { LoadingSection } from './components/LoadingSection'
import { LogoSection } from './components/LogoSection'
import { StatesSection } from './components/StatesSection'
import { TagsSection } from './components/TagsSection'
import { strings } from './strings'

/** Development-only page that displays every base component, to compare them with the design boards. */
export function StyleguideScreen() {
  return (
    <main className="mx-auto flex max-w-content flex-col gap-12 px-4 py-8 tablet:px-8 desktop:px-16">
      <header className="flex flex-col gap-2 border-b-4 border-double border-ink-900 pb-6">
        <h1 className="font-title text-poster">{strings.title}</h1>
        <p className="max-w-reading text-body text-ink-800">{strings.intro}</p>
      </header>
      <LogoSection />
      <IconsSection />
      <ButtonsSection />
      <TagsSection />
      <FieldsSection />
      <RichTextSection />
      <LoadingSection />
      <StatesSection />
      <AvatarsSection />
    </main>
  )
}
