import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'light' ? 'white' : 'gray.800',
      color: props.colorMode === 'light' ? 'gray.800' : 'white',
    },
  }),
}

const theme = extendTheme({ config, colors, styles })

export default theme 