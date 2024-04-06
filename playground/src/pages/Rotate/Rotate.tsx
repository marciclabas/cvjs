import { Button, HStack, Image, VStack } from "@chakra-ui/react"
import { cvtools } from 'opencv-tools'
import { useEffect, useState } from "react"
import { mod } from '@haskellian/mod'
import { prepareWorker } from 'opencv-tools/workers/rotate'

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
const api = prepareWorker(worker, console.debug.bind(console))

const ROTATIONS: (cvtools.Rotation|0)[] = [0, 90, 180, -90]

export function Rotate() {

  const url = '/images/sheet0.jpg'
  const [rot, setRot] = useState(0)
  const degrees = ROTATIONS[rot]
  const rotate = (delta: -1 | 1) => () => setRot(x => mod(x+delta, ROTATIONS.length))

  useEffect(() => { api.postImg(url) }, [])

  const [rotated, setRotated] = useState(url)

  async function doRotate() {
    if (degrees == 0) 
      setRotated(url)
    else {
      const blob = await api.rotate(url, degrees)
      if (blob)
        setRotated(URL.createObjectURL(blob))
    }
  }
  useEffect(() => { doRotate() }, [degrees])

  return (
    <VStack h='100vh' w='100vw' align='center' justify='center'>
      <HStack h='80%'>
        <Image src={url} maxW='100%' maxH='100%' transform={`rotate(${degrees}deg)`} />
        <Image src={rotated} maxW='100%' maxH='100%' />
      </HStack>
      <HStack>
        <Button onClick={rotate(-1)}>Rotate Left</Button>
        <Button onClick={rotate(1)}>Rotate Right</Button>
      </HStack>
    </VStack>
  )
}
export default Rotate
