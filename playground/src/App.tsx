import { Button, VStack } from "@chakra-ui/react"
import { RouteObject, useNavigate, useRoutes } from "react-router-dom";
import Usecamera from './pages/Usecamera'
import Permissions from './pages/Permissions'
import Usestream from './pages/Usestream'

const PLAYGROUND_PAGES: Record<string, JSX.Element> = {
  usestream: <Usestream />,
  permissions: <Permissions />,
  usecamera: <Usecamera />,
}

function Menu() {
  const goto = useNavigate()
  const menu = (
    <VStack h='100vh' w='100vw' align='center' justify='center'>
      <VStack h='max-content' gap='0.2rem'>
        {Object.entries(PLAYGROUND_PAGES).map(([page], i) => (
          <Button p='0.5rem' key={i} onClick={() => goto(page)}>{page}</Button>
        ))}
      </VStack>
    </VStack>
  )

  const routes: RouteObject[] = Object.entries(PLAYGROUND_PAGES).map(([page, element]) => ({
    path: page, element
  }))

  return useRoutes([...routes, { path: '*', element: menu }])
}

export default Menu
