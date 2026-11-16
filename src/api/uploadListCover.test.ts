// @vitest-environment node
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { aList } from '../test/fakeLists'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { uploadListCover } from './lists'

describe('uploadListCover', () => {
  it('sends the photo as the « file » part of a multipart form, to the list', async () => {
    let part: FormDataEntryValue | null = null
    let contentType: string | null = null
    server.use(
      http.put(`${API_BASE_URL}/lists/l-1/cover`, async ({ request }) => {
        contentType = request.headers.get('Content-Type')
        part = (await request.formData()).get('file')
        return HttpResponse.json(aList({ coverVersion: 'v1' }))
      }),
    )

    const list = await uploadListCover({
      listId: 'l-1',
      file: new File(['jpeg bytes'], 'noel.jpg', { type: 'image/jpeg' }),
    })

    expect(list.coverVersion).toBe('v1')
    expect(contentType).toContain('multipart/form-data; boundary=')
    expect(part).toMatchObject({ name: 'noel.jpg', type: 'image/jpeg', size: 10 })
  })
})
