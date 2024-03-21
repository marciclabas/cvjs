import { useCallback, useEffect, useMemo, useState } from "react"
import { useCapture, CaptureConfig, Status, Errored, Loaded } from "./use-capture.js"
import { ControlledProps, View } from "./Camera.js"
import { io } from "opencv-tools"

export type Hook = {
  /** Props to be passed to `<Camera {...cameraProps}>` */
  cameraProps: ControlledProps
  status: Status
  /** State of the UI:
   * - `'default'`: starting view (unless `config.autoStart`) and on `cancel()`
   * - `'loading'`: whilst asking permission for the camera and loading the video
   * - `'camera'`: streaming from the user's camera
   * - `'captured'`: snapshot taken with `take()`
   * - `'error'`: if the camera isn't accessible or denied (also if the user denies after starting successfully)
   */
  view: View
  /** Request permission (if not yet granted) and start streaming onto `video` */
  start(): Promise<Errored|Loaded>
  /** Show image onto `canvas` and extract a `Blob` from it */
  take(format?: io.Format): Promise<Blob|null>
  /** Sets `view` to `'camera'` (if `status.status === 'loaded'`) */
  retake(): void
  /** Sets `view` to `'default'` */
  cancel(): void
}

export type CameraConfig = Omit<CaptureConfig, 'onStop'> & {
  /** Defaults to `false` */
  autoStart?: boolean
}

export function useCamera(config?: CameraConfig): Hook {

  const [view, setView] = useState<View>(config?.autoStart ? 'loading' : 'default')
  const { canvasRef, videoRef, start: startCapture, take: takeCapture, status } = useCapture({
    ...config, onStop: () => setView('error')
  })

  const start = useCallback(async () => {
    setView('loading')
    const res = await startCapture()
    setView(res.status === 'error' ? 'error' : 'camera')
    return res
  }, [])

  const take = useCallback((format: io.Format) => { setView('captured'); return takeCapture(format)}, [])
  const cancel = useCallback(() => setView('default'), [])
  const retake = useCallback(() => { if (status.status === 'loaded') setView('camera') }, [])

  useEffect(() => {
    if (config?.autoStart)
      start()
  }, [config?.autoStart])

  return {
    cameraProps: { canvasRef, videoRef, view },
    status, view, start, take, cancel, retake,
  }
}