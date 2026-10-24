// @vitest-environment node
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { uploadMedia } from './media'

describe('uploadMedia', () => {
  it('sends the picture as the « file » part of a multipart form', async () => {
    let part: FormDataEntryValue | null = null
    server.use(
      http.post(`${API_BASE_URL}/media`, async ({ request }) => {
        part = (await request.formData()).get('file')
        return HttpResponse.json({ id: 'm1' }, { status: 201 })
      }),
    )

    await uploadMedia(new File(['jpeg bytes'], 'tarte.jpg', { type: 'image/jpeg' }))

    expect(part).toMatchObject({ name: 'tarte.jpg', type: 'image/jpeg', size: 10 })
  })

  it('gives up when the signal says the picture is not wanted any more', async () => {
    const controller = new AbortController()
    controller.abort()

    await expect(
      uploadMedia(new File(['jpeg bytes'], 'tarte.jpg', { type: 'image/jpeg' }), controller.signal),
    ).rejects.toBeDefined()
  })
})
