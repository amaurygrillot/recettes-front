import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import type { EditorValues, PhotoListName } from '../../editorModel'
import { strings } from '../../strings'
import { usePhotoUploads } from '../../usePhotoUploads'
import { useFollowedMove } from '../../useFollowedMove'
import { useReorder } from '../../useReorder'
import { AddPhotoSheet, AddPhotoTile, EmptyPhotos } from '../AddPhoto/AddPhoto'
import { PhotoProblemTile, SendingPhotoTile } from '../PendingPhotoTile/PendingPhotoTile'
import { usePhotoPicker } from '../PhotoPicker/usePhotoPicker'
import { PhotoTile } from '../PhotoTile/PhotoTile'
import { SortableItem, SortableList, type ReorderWords } from '../SortableList/SortableList'
import { PhotoAltText } from './PhotoAltText'

const { photos } = strings

export interface PhotoGalleryProps {
  name: PhotoListName
  /** The cover is a grid whose first photo is the cover; a step's photos are a row that scrolls. */
  variant: 'cover' | 'step'
}

const WORDS: ReorderWords = {
  lifted: photos.lifted,
  moved: photos.moved,
  dropped: photos.dropped,
  cancelled: photos.dragCancelled,
  instructions: photos.dragInstructions,
  grip: photos.gripRole,
}

/**
 * The photos of a list, each with its description, and the way to add more. Pictures are sent when
 * they are chosen and are in the recipe only once saved; they can be dragged, moved with arrows
 * or removed; a picture that could not be sent stays in its place with its reason until it is sent
 * again or given up.
 */
export function PhotoGallery({ name, variant }: PhotoGalleryProps) {
  const { control } = useFormContext<EditorValues>()
  const { fields, append, remove, move } = useFieldArray({ control, name })
  const described = useWatch({ control, name })
  const uploads = usePhotoUploads((mediaId) => {
    append({ mediaId, altText: '' })
  })
  const { pick, inputs } = usePhotoPicker(uploads.add)
  const [choosing, setChoosing] = useState(false)
  const { moveItem, announcement } = useReorder({
    count: fields.length,
    move,
    announce: photos.moved,
  })

  const { ref: list, follow } = useFollowedMove(fields)

  const total = fields.length
  const cover = variant === 'cover'

  function liftedTile(id: string) {
    const index = fields.findIndex((field) => field.id === id)
    const field = fields[index]
    if (field === undefined) return null
    const description = described[index]?.altText
    return (
      <PhotoTile
        lifted
        position={index + 1}
        total={total}
        mediaId={field.mediaId}
        cover={cover && index === 0}
        handle={{}}
        canMoveBack={index > 0}
        canMoveForward={index < total - 1}
        onMove={() => undefined}
        onRemove={() => undefined}
      >
        <p className="min-h-14 rounded-m border-2 border-ink-500 px-4 py-3 text-label text-ink-700">
          {description === undefined || description === ''
            ? photos.altTextPlaceholder
            : description}
        </p>
      </PhotoTile>
    )
  }

  const tilesOnTheirWay = (
    <>
      {uploads.pending.map((picture) => (
        <li key={picture.id} className="flex min-w-0 flex-col *:flex-1">
          {picture.problem === undefined ? (
            <SendingPhotoTile
              onCancel={() => {
                uploads.dismiss(picture.id)
              }}
            />
          ) : (
            <PhotoProblemTile
              problem={picture.problem}
              onRetry={() => {
                uploads.retry(picture.id)
              }}
              onGiveUp={() => {
                uploads.dismiss(picture.id)
              }}
            />
          )}
        </li>
      ))}
      <li className="flex min-w-0 flex-col *:flex-1">
        <AddPhotoTile
          onClick={() => {
            setChoosing(true)
          }}
        />
      </li>
    </>
  )

  return (
    <div ref={list} className="flex flex-col gap-3">
      {inputs}
      {cover && total === 0 && uploads.pending.length === 0 ? (
        <EmptyPhotos pick={pick} coverNote />
      ) : (
        <SortableList
          layout={cover ? 'grid' : 'row'}
          ids={fields.map(({ id }) => id)}
          words={WORDS}
          onReorder={moveItem}
          renderLifted={liftedTile}
          after={tilesOnTheirWay}
        >
          {fields.map((field, index) => (
            <SortableItem
              key={field.id}
              id={field.id}
              grip={photos.gripRole}
              dropHere={photos.dropHere}
            >
              {({ handle }) => (
                <PhotoTile
                  position={index + 1}
                  total={total}
                  mediaId={field.mediaId}
                  cover={cover && index === 0}
                  handle={handle}
                  canMoveBack={index > 0}
                  canMoveForward={index < total - 1}
                  onMove={(direction) => {
                    follow(field.id, direction === -1 ? 'back' : 'forward')
                    moveItem(index, index + direction)
                  }}
                  onRemove={() => {
                    remove(index)
                  }}
                >
                  <PhotoAltText name={name} index={index} />
                </PhotoTile>
              )}
            </SortableItem>
          ))}
        </SortableList>
      )}
      <AddPhotoSheet
        open={choosing}
        onClose={() => {
          setChoosing(false)
        }}
        pick={pick}
      />
      {cover && total > 1 && <p className="text-detail text-ink-800">{photos.reorderHint}</p>}
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
