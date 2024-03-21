import { Mat } from "opencv-ts";
import { Context, SizedSource, getCanvas, show, toBlob } from "./canvas.js";

/** Read an image from a URL, using an <img> element */
export async function readURL(url: string): Promise<ImageData|null> {
  const img = new Image();
  img.crossOrigin = 'anonymous'
  img.src = url;
  await img.decode().catch(e => console.error('Error decoding image', e));
  return writeData(img)
}

/** Read an image using `createImageBitmap` */
export async function readBlob(blob: Blob): Promise<ImageData|null> {
  const bitmap = await createImageBitmap(blob)
  return writeData(bitmap)
}

/** Reads a url or blob into `ImageData`
 * - If `img` is a url, tries to use an `<img>` element, otherwise defaults to `fetch` blob + `createImageBitmap`
 * - If `img` is a blob, uses `createImageBitmap` then defaults to `URL.createObjectURL` + `<img>`
 */
export async function read(img: string | Blob): Promise<ImageData|null> {
  if (typeof img === 'string') {
    try { return await readURL(img) }
    catch {
      const blob = await fetch(img).then(r => r.blob())
      return await readBlob(blob)
    }
  }
  else {
    try { return await readBlob(img) }
    catch {
      const url = URL.createObjectURL(img)
      const data = await readURL(url)
      URL.revokeObjectURL(url)
      return data
    }
  }
}

export function isMat(mat: any): mat is Mat {
  return (mat as Mat).isContinuous !== undefined && (mat as Mat).clone !== undefined
}

export function toData(img: Mat): ImageData {
  const mat = img.isContinuous() ? img : img.clone() // make sure data is continuous
  return new ImageData(new Uint8ClampedArray(mat.data), mat.cols, mat.rows)
}

export type Format = "png" | "jpeg" | "webp"
/** Write to `Blob` (tries to use `OffscreenCanvas`, defaults to `document.createElement` if not available) */
export async function writeBlob(img: Mat | ImageData | SizedSource, format?: Format): Promise<Blob|null> {
  const data = isMat(img) ? toData(img) : img
  const canvas = getCanvas(data.width, data.height)
  const shown = show(data, canvas)
  return shown
    ? await toBlob(canvas, format && `image/${format}`)
    : null
}

export async function writeData(img: SizedSource): Promise<ImageData|null> {
  const canvas = getCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d') as Context | null // typescript, man (he struggles with overloads)
  if (!ctx)
    return null
  show(img, canvas, ctx)
  return ctx.getImageData(0, 0, img.width, img.height)
}