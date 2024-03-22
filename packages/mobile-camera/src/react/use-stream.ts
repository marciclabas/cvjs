import { useCallback, useEffect, useRef, useState } from "react"
import { PresetConfig, getPresetVideo } from "../request/video.js"
import { MediaError } from "../request/errors.js"

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

export type StreamHook = Status & {
  start(): Promise<Errored | Loaded>
  stop(): void
}

export type StreamConfig = PresetConfig & {
  autoStart?: boolean
  onStop?(): void
  log?: Console['log']
}

export function useStream({ autoStart, onStop, log: cfgLog, ...config }: StreamConfig): StreamHook {

  const log = useCallback((...xs) => cfgLog?.('[useStream] ', ...xs), [cfgLog])
  const [status, setStatus] = useState<Status>({ status: autoStart ? 'loading' : 'not-started' })
  const streamRef = useRef<MediaStream | null>(null)

  const start = useCallback(async () => {
    setStatus({ status: 'loading' })
    log('Starting')
    const either = await getPresetVideo(config)
    const status: Status = either.tag === 'left'
      ? { status: 'error', error: either.value }
      : { status: 'loaded', stream: either.value }

    setStatus(status)

    if (either.tag === 'right') {
      const stream = either.value
      streamRef.current = stream
      stream.getVideoTracks().forEach(t => t.addEventListener('ended', () => {
        setStatus({ status: 'error', error: { name: 'stopped' } })
        onStop?.()
      }))
    }
    
    log(either.tag === 'left' ? 'Errored' : 'Succeeded', either.value)

    return status
  }, [config, onStop, log])

  const stop = useCallback(() => {
    if (streamRef.current) {
      log('Stopping')
      setStatus({ status: 'not-started' })
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    else
      log('Invalid ref, unable to stop')
  }, [log])

  useEffect(() => {
    if (autoStart) {
      log('Autostarting...')
      start()
    }
    return stop
  }, [autoStart]) // eslint-disable-line

  return { ...status, start, stop }
}