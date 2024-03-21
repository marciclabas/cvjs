import { Cv, Mat } from 'use-cv'
import * as io from '../../tools/io/io.js'
import { correct as correctFn } from '../../tools/perspective.js'
import { Action, Correct, PostImage } from "./api.js"

export function onMessage(cv: Cv, log?: Console['debug']) {

  const debug = log && ((...data: any[]) => log('[WORKER]:', ...data))

  const loaded: Promise<void> = new Promise(resolve => {
    cv.onRuntimeInitialized = () => {
      resolve()
      debug?.('OpenCV loaded')
    }
  })

  const images: Map<any, Mat> = new Map();

  async function setImage({ img, imgId }: PostImage): Promise<boolean> {
    const blob = typeof img === 'string' ? await fetch(img).then(r => r.blob()) : img
    const data = await io.read(blob)
    if (!data)
      return false
    const mat = cv.matFromImageData(data)
    debug?.('Stored new image', imgId)
    images.set(imgId, mat)
    return true
  }

  async function correct({ imgId, corners, pads }: Correct): Promise<Blob|null> {
    const mat = images.get(imgId)
    if (!mat)
      return null
    const corrected = correctFn(mat, corners, cv, pads)
    return await io.writeBlob(corrected)
  }

  async function onmessage(e: MessageEvent<Action>) {
    debug?.('Received message', e.data)
    await loaded
    if (e.data.action === 'post-img') {
      debug?.('Posting image')
      const succeeded = await setImage(e.data)
      debug?.(succeeded ? 'Successfuly posted' : 'Error posting', ' image:', e.data.imgId)
      postMessage(succeeded)
    }
    else if (e.data.action === 'correct') {
      debug?.('Correcting image')
      const corrected = await correct(e.data)
      debug?.('Corrected image:', corrected)
      postMessage(corrected)
    }
  }

  return onmessage
}