import React, { CSSProperties, ReactNode, Ref } from 'react';

export type View = 'default' | 'loading' | 'camera' | 'captured' | 'error'

export type ControlledProps = {
  /** Internal, to be passsed by `useCamera` */
  videoRef: Ref<HTMLVideoElement>
  /** Internal, to be passsed by `useCamera` */
  canvasRef: Ref<HTMLCanvasElement>
  /** Internal, to be passsed by `useCamera` */
  view: View
}
export type Props = {
  videoStyle?: CSSProperties
  canvasStyle?: CSSProperties
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
export function Camera({ videoRef, canvasRef, view, children, ...props }: Props & ControlledProps) {
  const videoStyle = props.videoStyle ?? { maxHeight: '100%', maxWidth: '100%' }
  const canvasStyle = props.canvasStyle ?? { maxHeight: '100%', maxWidth: '100%' }
  return (
    <>
      <video ref={videoRef} style={{ ...videoStyle, display: view === 'camera' ? undefined : 'none' }} />
      <canvas ref={canvasRef} style={{ ...canvasStyle, display: view === 'captured' ? undefined : 'none' }} />
      {view === 'default' && children?.default}
      {view === 'loading' && children?.loading}
      {view === 'error' && children?.error}
    </>
  )
}

export default Camera