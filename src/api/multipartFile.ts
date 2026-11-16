/**
 * The request of an upload: one multipart part named `file`. The generated type calls the file a
 * string (the contract cannot say « binary » in a way the typed client builds), so the real body is
 * made here.
 */
export function multipartFileRequest(file: File) {
  return {
    body: { file: '' },
    bodySerializer: () => {
      const form = new FormData()
      form.append('file', file)
      return form
    },
  }
}
