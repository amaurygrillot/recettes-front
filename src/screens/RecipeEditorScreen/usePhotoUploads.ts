import { useEffect, useRef, useState } from 'react'
import { ApiRequestError, type ApiFailure } from '../../api/failure'
import { uploadMedia } from '../../api/media'
import { logger } from '../../lib/logger'
import { problemFromFailure, problemWithFile, type UploadProblem } from './photoUpload'
import { useUploadTracker } from './uploadTracker'

const UNEXPECTED: ApiFailure = { kind: 'unexpected', status: undefined, detail: undefined }

function failureOf(error: unknown): ApiFailure {
  return error instanceof ApiRequestError ? error.failure : UNEXPECTED
}

/** A picture that is not stored yet: on its way, or refused (and then it says why). */
export interface PendingPhoto {
  id: number
  file: File
  problem: UploadProblem | undefined
}

export interface PhotoUploads {
  pending: readonly PendingPhoto[]
  /** Sends the chosen files, one after the other, in the order they were chosen. */
  add: (files: readonly File[]) => void
  /** Sends a refused picture again. */
  retry: (id: number) => void
  /** Gives a picture up: stops it when it is on its way, forgets it when it was refused. */
  dismiss: (id: number) => void
}

/**
 * The pictures being added to a list: each is checked, sent (one at a time, so that the order of
 * the list is the order they were chosen in), and handed to `onStored` with its media id once the
 * back end has it. A refused picture stays where it was with its reason until it is sent again or
 * given up. What is still on its way is counted by the editor's tracker.
 */
export function usePhotoUploads(onStored: (mediaId: string) => void): PhotoUploads {
  const tracker = useUploadTracker()
  const [pending, setPending] = useState<readonly PendingPhoto[]>([])
  const nextId = useRef(0)
  const controllers = useRef(new Map<number, AbortController>())
  const queue = useRef<Promise<void>>(Promise.resolve())
  // The latest `onStored`: a picture can arrive after the list it was added to has changed.
  const stored = useRef(onStored)
  useEffect(() => {
    stored.current = onStored
  })

  useEffect(() => {
    const running = controllers.current
    return () => {
      for (const controller of running.values()) controller.abort()
    }
  }, [])

  function fail(id: number, problem: UploadProblem): void {
    setPending((current) => current.map((item) => (item.id === id ? { ...item, problem } : item)))
  }

  function send(id: number, file: File): void {
    const controller = new AbortController()
    controllers.current.set(id, controller)
    const release = tracker.begin()
    // A function, so that what was true before an await is not taken for what is true after it.
    const givenUp = () => controller.signal.aborted

    const upload = async (): Promise<void> => {
      try {
        // Given up while it waited for the pictures before it.
        if (givenUp()) return
        const media = await uploadMedia(file, controller.signal)
        if (givenUp()) return
        if (media.id === undefined) {
          fail(id, problemFromFailure(UNEXPECTED))
          return
        }
        stored.current(media.id)
        setPending((current) => current.filter((item) => item.id !== id))
      } catch (error) {
        if (givenUp()) return
        logger.warn('A picture was not stored')
        fail(id, problemFromFailure(failureOf(error)))
      } finally {
        controllers.current.delete(id)
        release()
      }
    }
    queue.current = queue.current.then(upload)
  }

  return {
    pending,
    add: (files) => {
      const added = files.map((file): PendingPhoto => {
        nextId.current += 1
        return { id: nextId.current, file, problem: problemWithFile(file) }
      })
      setPending((current) => [...current, ...added])
      for (const { id, file, problem } of added) if (problem === undefined) send(id, file)
    },
    retry: (id) => {
      const picture = pending.find((item) => item.id === id)
      if (picture === undefined) return
      setPending((current) =>
        current.map((item) => (item.id === id ? { ...item, problem: undefined } : item)),
      )
      send(id, picture.file)
    },
    dismiss: (id) => {
      controllers.current.get(id)?.abort()
      controllers.current.delete(id)
      setPending((current) => current.filter((item) => item.id !== id))
    },
  }
}
