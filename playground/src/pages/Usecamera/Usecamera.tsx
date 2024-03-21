import { Button, HStack, Text, VStack } from "@chakra-ui/react"
import { useCamera, Camera } from 'mobile-camera/react'


export function Usecamera() {

  const { cameraProps, cancel, view, retake, start, status, take } = useCamera({ autoStart: true })

  const msg =
    status.status === 'not-started' ? 'Click to start' :
    status.status === 'loading' ? 'Loading...' :
    status.status === 'error' ? 'Camera inaccessible :/' :
    status.status === 'loaded' ? JSON.stringify(status.stream.getTracks()[0].getSettings()) : ''

    const buttons =
      status.status === 'not-started' ? <Button onClick={start}>Start</Button> :
      view === 'camera' ? <><Button onClick={() => take()}>Take</Button><Button onClick={cancel}>Cancel</Button></> :
      <Button onClick={retake}>Retake</Button>

  return (
    <VStack h='100vh' w='100vw' align='center' justify='center'>
      <HStack h='100%' w='100%' align='center' justify='center'>
        <VStack w='80%' align='center'>
          <Camera {...cameraProps}>
            {{
              default: <Text>Click to start!</Text>,
              error: <Text>Camera inaccessible :/</Text>,
              loading: <Text>Loading...</Text>
            }}
          </Camera>
        </VStack>
        <VStack w='20%'>
          {buttons}
          <Text maxWidth='10rem'>{msg}</Text>
          <Text maxWidth='10rem'>{status.status}</Text>
        </VStack>
      </HStack>
    </VStack>
  )
}
export default Usecamera
