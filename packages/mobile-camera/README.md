# Mobile Camera

> Tools for dealing with cameras in mobile browsers. Optionally, a `Camera` React component

## Safe, fallbacked media requests

```js
import { getVideo } from 'mobile-camera'

const resolutions = [{ width: 2704, height: 1520 }, { width: 1280, height: 720 }]
const result = await getVideo(resolutions, { facingMode: 'environment' })
// Either<MediaError, MediaStream>
```

Or, use resolution presets with automatic fallbacks:

```js
import { getPresetVideo } from 'mobile-camera'

await getPresetVideo({ resolution: '2.7K', aspectRatio: '4:3', facingMode: 'environment' })
```

## React Hooks and Components

### Fully-controlled

```jsx
import { useCamera, Camera } from 'mobile-camera/react'

function MyCamera() {
  const { cameraProps, take, ...moreStuff } = useCamera({ autoStart: true })
  return (
    <Camera {...cameraProps}>
      {{
        default: <p>Click to start!</p>,
        error: <p>Camera inaccessible :/</p>,
        loading: <p>Loading...</p>,
      }}
    </Camera>
  )
}
```

### Bare-bones

```jsx
import { useCapture } from 'mobile-camera/react'

function MyCamera() {

  const { canvasRef, videoRef, start, take } = useCapture()

  async function takeImage() {
    const blob = await take('jpeg')
    // ...
  }

  return (
    <div>
      <canvas ref={canvasRef}> {/* Snapshots when calling `take()` shown here */}
      <video ref={videoRef}> {/* Live user's camera shown here */}
    </div>
  )
}
```