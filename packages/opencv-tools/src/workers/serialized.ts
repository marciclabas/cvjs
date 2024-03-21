import { Mat } from "opencv-ts"
import { toData } from "../tools/io/io.js"

export type SerializedImg = {
  buffer: ArrayBufferLike
  width: number
  height: number
}

export type PostableImg = [SerializedImg, Transferable[]]

/** Serialize `ImageData` into `worker.postMessage` format
 * 
 *  - Send image exclusively:
 *    ```
 *    worker.postMessage(...serialize(imgData))
 *    ```
 *  - Send more stuff:
 *    ```
 *    const [data, transfer] = serialize(imgData)
 *    worker.postMessage({ ...stuff, data }, [...stuff, ...transfer])
 *    ```
 */
export function serialize(mat: Mat): PostableImg;
export function serialize(imgData: ImageData): PostableImg;
export function serialize(img: Mat | ImageData): PostableImg {

  const { data, width, height } = img instanceof ImageData ? img : toData(img)

  return [
    { buffer: data.buffer, width, height },
    [data.buffer]
  ]
}

export function deserialize({ buffer, width, height }: SerializedImg): ImageData {
  return new ImageData(new Uint8ClampedArray(buffer), width, height)
}