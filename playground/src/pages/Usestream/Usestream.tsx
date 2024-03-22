import { Box, Button, ButtonGroup, HStack, Image, Text, VStack } from "@chakra-ui/react"
import { CSSProperties, useCallback, useState } from "react"
import { useVideo, useStream, useCapture, useCamera } from 'mobile-camera/react'

type Props = {
  stream: MediaStream | null
}
export function Cam({ stream }: Props) {

  const camera = useCamera(stream, { log: console.debug.bind(console) })
  const [url, setUrl] = useState<string|null>(null)

  const take = useCallback(async () => {
    const blob = await camera.take()
    blob && setUrl(URL.createObjectURL(blob))
  }, [camera])

  return (
    <VStack h='100%' w='100%' align='center' justify='center'>
      <HStack h='80%' w='80%'>
        <video ref={camera.ref} style={{ maxHeight: '100%', maxWidth: '100%' }} />
        {url && <Image src={url} maxW='8rem' />}
      </HStack>
      <ButtonGroup>
        {camera.state === 'playing'
          ? <Button onClick={take}>Take</Button>
          : <Button onClick={camera.retake}>Retake</Button>
        }
      </ButtonGroup>
    </VStack>
  )
}

export function App() {

  const [view, setView] = useState(true)

  const stream = useStream({
    aspectRatio: '4:3', resolution: '2.7K', facingMode: 'environment',
    autoStart: false, onStop: useCallback(() => console.log('Stopped!'), []),
    log: console.debug.bind(console)
  })

  return (
    <VStack h='100vh' w='100vw' align='center' justify='center'>
      {stream.status === 'not-started' && <Button onClick={stream.start}>Start</Button>}
      {stream.status === 'error' && <Button onClick={stream.start}>Retry</Button>}
      {stream.status === 'loading' && <Text>Loading...</Text>}
      {(stream.status === 'loaded' || stream.status === 'loading') && (
        <>
          <Button onClick={() => setView(x => !x)}>Toggle Camera</Button>
          <Text>Camera {view ? 1 : 2}</Text>
          {view
            ? <Cam key={1} stream={stream.status === 'loading' ? null : stream.stream} />
            : <Cam key={2} stream={stream.status === 'loading' ? null : stream.stream} />
          }
        </>
      )}
    </VStack>
  )
}
export default App
