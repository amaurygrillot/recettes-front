import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { problemResponse, rejectionOf } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { mediaUrl, useUploadMedia } from './media'

const url = `${API_BASE_URL}/media`

// The multipart content itself is checked in uploadMedia.test.ts, which runs under Node: jsdom's
// FormData and File cannot be serialised by Node's fetch once a handler reads the body.
function pictureToUpload(): File {
  return new File(['jpeg bytes'], 'tarte.jpg', { type: 'image/jpeg' })
}

describe('mediaUrl', () => {
  it.each([
    ['full size by default', mediaUrl('abc'), `${url}/abc`],
    ['full size when asked', mediaUrl('abc', 'full'), `${url}/abc`],
    ['the thumbnail', mediaUrl('abc', 'thumbnail'), `${url}/abc?variant=thumbnail`],
    ['an id that needs escaping', mediaUrl('a/b c'), `${url}/a%2Fb%20c`],
  ])('points at %s', (_name, actual, expected) => {
    expect(actual).toBe(expected)
  })
})

describe('useUploadMedia', () => {
  it('answers the stored media, whose id the recipe will reference', async () => {
    let contentType: string | null = null
    server.use(
      http.post(url, ({ request }) => {
        contentType = request.headers.get('Content-Type')
        return HttpResponse.json(
          { id: 'm1', mediaType: 'PHOTO', contentType: 'image/jpeg' },
          { status: 201 },
        )
      }),
    )
    const { result } = renderHook(() => useUploadMedia(), { wrapper: createQueryWrapper().wrapper })

    const media = await act(() => result.current.mutateAsync(pictureToUpload()))

    expect(media).toMatchObject({ id: 'm1', mediaType: 'PHOTO' })
    expect(contentType).toMatch(/^multipart\/form-data; boundary=/)
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [413, 'payload-too-large'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.post(url, () => problemResponse(status)))
    const { result } = renderHook(() => useUploadMedia(), { wrapper: createQueryWrapper().wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync(pictureToUpload())))

    expect(error).toMatchObject({ failure: { kind, status } })
  })

  it.each([
    [429, 'rate-limited'],
    [503, 'unavailable'],
  ])('tells how long to wait when the back end answers %i', async (status, kind) => {
    server.use(http.post(url, () => problemResponse(status, 'Try later', { 'Retry-After': '30' })))
    const { result } = renderHook(() => useUploadMedia(), { wrapper: createQueryWrapper().wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync(pictureToUpload())))

    expect(error).toMatchObject({ failure: { kind, status, retryAfterSeconds: 30 } })
  })
})
