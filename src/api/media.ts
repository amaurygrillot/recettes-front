import { useMutation } from '@tanstack/react-query'
import { logger } from '../lib/logger'
import { API_BASE_URL } from './apiConfig'
import { api } from './client'
import { unwrap } from './unwrap'

export type MediaVariant = 'full' | 'thumbnail'

/** Where a picture is served from: public and immutable, so it goes straight into an `<img src>`. */
export function mediaUrl(id: string, variant: MediaVariant = 'full'): string {
  const url = `${API_BASE_URL}/media/${encodeURIComponent(id)}`
  return variant === 'full' ? url : `${url}?variant=${variant}`
}

/** Sends one picture. The signal ends the request when the person gives the picture up. */
export function uploadMedia(file: File, signal?: AbortSignal) {
  logger.info('Uploading a picture', { sizeBytes: file.size })
  return unwrap(
    api.POST('/media', {
      ...(signal === undefined ? {} : { signal }),
      // The generated type calls the file a string; the real body is multipart, built here.
      body: { file: '' },
      bodySerializer: () => {
        const form = new FormData()
        form.append('file', file)
        return form
      },
    }),
  )
}

/**
 * Uploads one JPEG or PNG (8 MB at most) and answers the stored media, whose id the recipe then
 * references. Fails with `payload-too-large` (413), `rate-limited` (429) or `unavailable` (503).
 */
export function useUploadMedia() {
  return useMutation({ mutationFn: (file: File) => uploadMedia(file) })
}
