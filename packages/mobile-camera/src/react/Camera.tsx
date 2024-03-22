import React, { CSSProperties, ReactNode, Ref } from 'react';

export type View = 'default' | 'loading' | 'camera' | 'captured' | 'error'

export type ControlledProps = {
  /** Internal, to be passsed by `useCamera` */
  videoRef: Ref<HTMLVideoElement>
  /** Internal, to be passsed by `useCamera` */
  view: View
}
export type CameraProps = {
  style?: CSSProperties
  children?: {
    default?: ReactNode
    loading?: ReactNode
    error?: ReactNode
  }
}

/** Controlled camera, to be used with `useCamera()`
 * - `children`: elements displayed depending on `view`
 * - `videoRef`, `canvasRef` and `view` are internal and should be passed in from `const { cameraProps } = useCamera()`
 */
export function Camera({ videoRef, style, view, children }: CameraProps & ControlledProps) {
  return (
    <>
      <video ref={videoRef} style={{ ...style, display: view === 'camera' || view === 'captured' ? undefined : 'none' }} />
      {view === 'default' && children?.default}
      {view === 'loading' && children?.loading}
      {view === 'error' && children?.error}
    </>
  )
}

export default Camera