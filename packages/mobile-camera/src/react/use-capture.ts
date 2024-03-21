import { Ref, useCallback, useRef, useState } from "react"
import { MediaError, PresetConfig, getPresetVideo } from "../index.js"
import { io } from 'opencv-tools'
import { loadVideo } from "../utils.js"

export type Hook = {
  /** Canvas where still pictures are show. Must be always mounted */
  canvasRef: Ref<HTMLCanvasElement>
  /** Video where live camera footage is shown, Must be always mounted */
  videoRef: Ref<HTMLVideoElement>
  status: Status
  /** Request permission (if not yet granted) and start streaming onto `video` */
  start(): Promise<Errored | Loaded>
  /** Show image onto `canvas` and extract a `Blob` */
  take(format?: io.Format): Promise<Blob|null>
}

export type Status = {
  status: 'not-started' | 'loading'
} | Loaded | Errored

export type Loaded = {
  status: 'loaded'
  stream: MediaStream
}

export type Errored = {
  status: 'error'
  error: MediaError | { name: 'null-ref' } | { name: 'stopped' }
}

export type CaptureConfig = PresetConfig & {
  /** Called if the stream stops midway (e.g. because the user canceled permission). Also `status` will be set to `error` */
  onStop(): void
}

export function useCapture(config?: CaptureConfig): Hook {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [status, setStatus] = useState<Status>({ status: 'not-started' })

  const start = useCallback(async (): Promise<Errored | Loaded> => {
    setStatus({ status: 'loading' })
    const video = videoRef.current
    if (!video) {
      const status: Status = { status: 'error' , error: { name: 'null-ref' }}
      setStatus(status)
      return status
    }

    const either = await getPresetVideo(config)
    if (either.tag === 'left') {
      const status: Status = { status: 'error', error: either.value }
      setStatus(status)
      return status
    }

    const stream = either.value
    await loadVideo(video, stream)
    video.play()
    const status: Status = { status: 'loaded', stream }
    setStatus(status)

    stream.getTracks().forEach(t => t.addEventListener('ended', (e) => {
      setStatus({ status: 'error', error: { name: 'stopped' }})
      config?.onStop?.()
    }))

    return status
  }, [])

  const take = useCallback(async (format?: io.Format): Promise<Blob|null> => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas)
      return null

    if (!io.show(video, canvas))
      return null
    return await io.writeBlob(canvas, format)
  }, [])

  return { canvasRef, videoRef, start, status, take }
}