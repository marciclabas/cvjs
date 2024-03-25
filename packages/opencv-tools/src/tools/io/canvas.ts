import { readBlob } from "./io.js"

/** Tries to create an `OffscreenCanvas`, defaults to `document.createElement('canvas')` if not available */
export function getCanvas(width: number, height: number): OffscreenCanvas | HTMLCanvasElement {
  try {
    return new OffscreenCanvas(width, height)
  }
  catch {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }
}

/** `CanvasImageSource`, but only those that have `width: number` and `height: number` */
export type SizedSource = Exclude<CanvasImageSource, VideoFrame | SVGElement>

export type Context = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D

export function show(img: ImageData | SizedSource, canvas: HTMLCanvasElement | OffscreenCanvas): boolean;
export function show(img: ImageData | SizedSource, canvas: HTMLCanvasElement | OffscreenCanvas, context: Context): void;
/** Draws `img` unto the `canvas` */
export function show(img: ImageData | SizedSource, canvas: HTMLCanvasElement | OffscreenCanvas, context?: Context) {
  const ctx = context ?? canvas.getContext('2d') as Context | null
  if (!ctx)
    return false
  const width = (img as HTMLVideoElement).videoWidth ?? img.width;
  const height = (img as HTMLVideoElement).videoHeight ?? img.height;
  console.log('Size:', width, height)
  canvas.width = width
  canvas.height = height
  if (img instanceof ImageData)
    ctx.putImageData(img, 0, 0)
  else
    ctx.drawImage(img, 0, 0)
  return true
}

/** Unifies the interface of `HTMLCanvasElement.toBlob` and `OffscreenCanvas.convertToBlob`  */
export function toBlob(canvas: HTMLCanvasElement | OffscreenCanvas, type?: string, quality?: any): Promise<Blob|null> {
  return canvas instanceof OffscreenCanvas
    ? canvas.convertToBlob({ type, quality })
    : new Promise(resolve => {
      canvas.toBlob(resolve, type, quality)
    })
}