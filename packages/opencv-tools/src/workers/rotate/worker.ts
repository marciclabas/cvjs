import { Cv, Mat } from 'use-cv'
import * as io from '../../tools/io/io.js'
import { rotate as rotateFn } from '../../tools/rotation.js'
import { Action, Rotate, PostImage } from "./api.js"

export function onMessage(cv: Cv, log?: Console['debug']) {

  const debug = log && ((...data: any[]) => log('[ROTATE-WORKER]:', ...data))

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

  async function correct({ imgId, rotation }: Rotate): Promise<Blob|null> {
    const mat = images.get(imgId)
    if (!mat)
      return null
    const rotated = rotateFn(mat, rotation, cv)
    return await io.writeBlob(rotated)
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
    else if (e.data.action === 'rotate') {
      debug?.('Rotating image')
      const rotated = await correct(e.data)
      debug?.('Rotated image:', rotated)
      postMessage(rotated)
    }
  }

  return onmessage
}