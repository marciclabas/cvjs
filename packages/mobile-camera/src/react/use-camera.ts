import { io } from "opencv-tools"
import { MutableRefObject, Ref, useCallback, useRef, useState } from "react"
import { VideoConfig, useVideo } from "./use-video.js"

export type CameraHook = {
  ref: Ref<HTMLVideoElement>
  state: 'playing' | 'paused'
  take(): Promise<Blob|null>
  retake(): void
}

export type CameraConfig = {
  format?: io.Format
  log?: Console['log']
}

export function useCamera(stream: MediaStream | null, config?: CameraConfig): CameraHook {

  const log = useCallback((...xs) => config?.log?.('[useCamera]', ...xs), [config?.log])

  const [state, setState] = useState<CameraHook['state']>('playing')
  const video = useVideo(stream, { autoplay: true, log })

  const take = useCallback(async () => {
    video.pause()
    if (video.video.current) {
      log('Taking picture')
      setState('paused')
      const blob = await io.writeBlob(video.video.current)
      log(...(blob ? ['Picture taken:', blob] : ['Error taking picture']))
      return blob
    }
    log('Invalid ref, unable to take picture')
    return null
  }, [])

  const retake = useCallback(() => {
    log('Retaking image')
    video.play()
    setState('playing')
  }, [])

  return { ref: video.ref, take, retake, state }
}