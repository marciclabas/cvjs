/** Encoded `blob` as a URL-safe base64 string (has '-' instead of '+', and '_' instead of '/') */
export async function toBase64(blob: Blob): Promise<string> {
  const reader = new FileReader()
  const promise = new Promise<string>(resolve => {
    reader.onload = e => resolve(e.target?.result as string)
  })
  reader.readAsDataURL(blob)
  const dataURL = await promise // data:image/jpeg;base64,ACTUAL_BASE64_STRING
  const b64 = dataURL.split(',')[1]
  return b64.replace(/\+/g, '-').replace(/\//g, '_')
}