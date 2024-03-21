import { Button, Heading, Text, VStack } from "@chakra-ui/react"
import { getPresetVideo } from 'mobile-camera'
import { useState } from "react"

export function Permissions() {

  const [status, setStatus] = useState<string>('na')

  async function request() {
    const either = await getPresetVideo('2.7K')
    setStatus(JSON.stringify(either))
  }

  return (
    <VStack h='100vh' w='100vw' align='center' justify='center'>
      <Heading>Camera Permissions</Heading>
      <Button onClick={request}>Request</Button>
      <Text fontSize='2rem'>Status: {status}</Text>
    </VStack>
  )
}
export default Permissions
