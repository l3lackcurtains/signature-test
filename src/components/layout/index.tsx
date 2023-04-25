import { Box, Container } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

interface Props {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <Box margin="0 auto" minH="100vh">
      <Header />

      <Container maxW="container.lg">{props.children}</Container>

      <Footer />
    </Box>
  )
}
