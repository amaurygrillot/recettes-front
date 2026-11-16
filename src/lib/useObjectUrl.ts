import { useEffect, useSyncExternalStore } from 'react'

/**
 * The addresses of the pictures held in memory, shared by everything that shows the same blob and
 * revoked when the last of them stops. An object URL is a resource outside React, so it is kept in a
 * small external store rather than copied into state by an effect.
 */
const urls = new Map<Blob, { url: string; holders: number }>()
const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => {
    listener()
  })
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function acquire(blob: Blob): void {
  const held = urls.get(blob)
  if (held === undefined) urls.set(blob, { url: URL.createObjectURL(blob), holders: 1 })
  else held.holders += 1
  notify()
}

function release(blob: Blob): void {
  const held = urls.get(blob)
  if (held === undefined) return
  held.holders -= 1
  if (held.holders > 0) return
  URL.revokeObjectURL(held.url)
  urls.delete(blob)
  notify()
}

/**
 * An address a picture held in memory can be shown from: made when the blob arrives, revoked as
 * soon as nothing shows it any more (another blob, or the component leaving), so the browser can
 * let the bytes go.
 */
export function useObjectUrl(blob: Blob | null | undefined): string | undefined {
  useEffect(() => {
    if (blob === null || blob === undefined) return undefined
    acquire(blob)
    return () => {
      release(blob)
    }
  }, [blob])

  return useSyncExternalStore(subscribe, () =>
    blob === null || blob === undefined ? undefined : urls.get(blob)?.url,
  )
}
