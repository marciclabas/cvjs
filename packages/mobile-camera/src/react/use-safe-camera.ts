import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { ControlledProps, View } from "./Camera.js"
import { CameraConfig, useCamera } from "./use-camera.js"
import { StreamHook } from "./use-stream.js"

export type SafeCameraHook = {
  /** Props to be passed to `<Camera {...cameraProps}>` */
  cameraProps: ControlledProps
  /** State of the UI:
   * - `'default'`: starting view (unless `config.autoStart`) and on `cancel()`
   * - `'loading'`: whilst asking permission for the camera and loading the video
   * - `'camera'`: streaming from the user's camera
   * - `'captured'`: snapshot taken with `take()`
   * - `'error'`: if the camera isn't accessible or denied (also if the user denies after starting successfully)
   */
  view: View
  /** Pauses video and extracts a `Blob` from it */
  take(): Promise<Blob|null>
  /** Sets `view` to `'camera'` or `'default'` (if `status.status === 'loaded'`) */
  setCamera(on: boolean): void
}

export type SafeCameraConfig = CameraConfig & {
  /** Defaults to `false` */
  autoStart?: boolean
}

export function useSafeCamera(stream: StreamHook, config?: SafeCameraConfig): SafeCameraHook {

  const [desiredView, setView] = useState<View>(config?.autoStart ? 'camera' : 'default')
  const camera = useCamera(stream.status === 'loaded' ? stream.stream : null, config)

  const view = useMemo((): View => {
    switch (stream.status) {
      case 'error':
        return 'error'
      case 'loaded':
        return desiredView
      case 'loading':
        return 'loading'
      case 'not-started':
        return 'default'
    }
  }, [desiredView, stream.status])

  const take = useCallback(() => {
    setView('captured')
    return camera.take()
  }, [])

  const setCamera = useCallback((on: boolean) => {
    setView(on ? 'camera' : 'default')
    on && camera.retake()
  }, [])

  return {
    cameraProps: { videoRef: camera.ref, view },
    view, take, setCamera
  }
}