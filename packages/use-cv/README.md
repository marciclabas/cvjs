# Use Open CV (use-cv)
React + Typescript Hooks API for OpenCV.js

## Why

1. Lazy loading
2. Type defs -> awesome linting

## Why Not

Many OpenCV operations will block the main thread for too long. Consider using web workers instead (see below for details)

## Usage

```jsx
// provider
import { OpenCvProvider } from 'use-cv';
function App() {
    return (
        <OpenCvProvider>
            <Component />
        </OpenCvProvider>
    )
}

// context hook
import { useOpenCv } from 'use-cv';
function Component() {
    const { cv } = useOpenCv(); // Cv | null
}

// type defs
import { Cv, Mat } from 'use-cv';
```

## Web Workers

> The specifics apply to Vite React x Typescript apps only (other set-ups are untested). Still concepts apply.

### Goals

- Get typing support for OpenCV inside web workers
- Use the same copy for the main thread and any web workers (for caching)

### How to

Basically copy and paste this:

```typescript
// worker.ts
/// <reference lib="WebWorker" />
import type { Cv } from "use-cv";
importScripts('https://docs.opencv.org/4.5.0/opencv.js') // use the same source as in <OpenCvProvider>
declare global {
  const  cv: Cv
}

const loaded = new Promise(resolve => {
    cv.onRuntimeInitialized = () => resolve
})

onmessage = async e => {
    await loaded
    // use `cv`
}

```

> For some tools to simplify interaction with web workers (including (de)serialization), you may check out the package [opencv-tools](https://www.npmjs.com/package/opencv-tools)

## Credits

Type defs from [opencv-ts](https://www.npmjs.com/package/opencv-ts)

