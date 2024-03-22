import { MutableRefObject, Ref, useCallback, useRef } from "react"
import { loadVideo } from "../utils.js"

export type VideoHook = {
  /** Video where live camera footage is shown. Must be always mounted */
  ref: Ref<HTMLVideoElement>
  video: MutableRefObject<HTMLVideoElement|null>
  play(): void
  pause(): void
}

export type VideoConfig = {
  autoplay?: boolean
  log?: Console['log']
}

export function useVideo(stream: MediaStream | null, config?: VideoConfig): VideoHook {
  const videoRef = useRef<HTMLVideoElement|null>(null)
  const log = useCallback((...xs) => config?.log?.('[useVideo] ', ...xs), [config?.log])

  const callback = useCallback(async (video: HTMLVideoElement | null) => {
    videoRef.current = video
    if (video && stream) {
      log('Loading video')
      await loadVideo(video, stream)
      log('Loaded video')
      if (config?.autoplay)
      video.play()
    }
    if (!stream)
      log('Stream unavailable')
    else
      log('Video unmounted')
  }, [stream])

  const play = useCallback(() => {
    if (videoRef.current) {
      log('Playing video')
      videoRef.current.play()
    }
    else
      log('Invalid ref, unable to play video')
  }, [])

  const pause = useCallback(() => {
    if (videoRef.current) {
      log('Pausing video')
      videoRef.current.pause()
    }
    else
      log('Invalid ref, unable to stop video')
  }, [])

  return { ref: callback, video: videoRef, play, pause }
}