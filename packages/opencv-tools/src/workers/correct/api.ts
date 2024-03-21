import { managedPromise } from '@haskellian/async/promises/single/managed.js'
import { Corners, Paddings } from '../../tools/perspective.js'

export type PostImage = {
  action: 'post-img'
  img: string | Blob
  imgId: any
}
export type Correct = {
  action: 'correct'
  corners: Corners
  imgId: any
  pads?: Partial<Paddings>
}
export type Action = PostImage | Correct
export type Return<A extends Action> = A extends PostImage ? Promise<boolean> : Promise<Blob>

export type CorrectAPI = {
  /** Optimization: send the image upfront so the first `extract` call doesn't take the extra, significant hit
   * - `img`: the image url or blob
   * - `imgId`: reference to the image
   * - Returns whether it succeeds (it may fail, e.g. due to `OffscreenCanvas` not being available)
   */
  postImg(img: string | Blob): Promise<boolean>
  correct(img: string | Blob, corners: Corners, pads?: Partial<Paddings>): Promise<Blob|null>
}

/** Prepares worker by setting `worker.onmessage`. Do not modify it after preparing! */
export function prepareWorker(worker: Worker, log?: Console['debug']): CorrectAPI {

  const debug = log && ((...xs) => log('[CorrectAPI]:', ...xs))

  let counter = 0
  const imgIDs = new Map<Blob|string, number>()

  let postPromise = managedPromise<boolean>()
  let correctPromise = managedPromise<Blob|null>()

  worker.onmessage = async ({ data }: MessageEvent<Blob|null|boolean>) => {
    if (typeof data === 'boolean')
      postPromise.resolve(data)
    else
      correctPromise.resolve(data)
  }

  /** Stores image into `imgIDs`, posts to worker, returns the assigned key */
  async function postNewImg(img: string | Blob): Promise<number|null> {
    postPromise = managedPromise()
    const imgId = counter++
    debug?.(`New image. ID = ${imgId}. Src:`, img)
    imgIDs.set(img, imgId)
    const msg: PostImage = { img, imgId, action: 'post-img' }
    worker.postMessage(msg)
    const succeeded = await postPromise
    if (!succeeded) {
      imgIDs.delete(img)
      return null
    }
    return imgId
  }

  return {
    async postImg(img) {
      return (await postNewImg(img)) !== null
    },
    async correct(img, corners, pads) {
      correctPromise = managedPromise()
      const imgId = imgIDs.get(img) ?? await postNewImg(img)
      if (imgId === null)
        return null
      debug?.('Correcting image', imgId)
      const msg: Correct = { imgId, corners, pads, action: 'correct' }
      worker.postMessage(msg)
      return await correctPromise
    },
  }
}