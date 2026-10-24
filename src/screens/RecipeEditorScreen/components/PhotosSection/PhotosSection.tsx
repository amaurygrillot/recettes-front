import { strings } from '../../strings'
import { EditorSection } from '../EditorSection/EditorSection'
import { PhotoGallery } from '../PhotoGallery/PhotoGallery'

/** Section 2: the cover photos of the recipe. Optional, and the first is the cover. */
export function PhotosSection() {
  return (
    <EditorSection id="photos" number={2} title={strings.sections.photosTitle}>
      <PhotoGallery name="photos" variant="cover" />
    </EditorSection>
  )
}
