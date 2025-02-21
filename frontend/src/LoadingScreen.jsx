import { Box, VStack, Image, Text, useColorModeValue } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`

function LoadingScreen() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const gradientBg = useColorModeValue(
    'linear(to-r, blue.100, purple.100, blue.100)',
    'linear(to-r, blue.900, purple.900, blue.900)'
  )

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      zIndex="9999"
    >
      <VStack spacing={8}>
        <Box
          animation={`${pulse} 2s infinite ease-in-out`}
          transition="all 0.3s"
        >
          <Image
            src="/assets/trachycoinlogo.svg"
            alt="TrachyCoin Logo"
            boxSize="200px"
          />
        </Box>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={textColor}
          animation={`${fadeIn} 1s ease-in`}
        >
          Loading TrachyCoin...
        </Text>
      </VStack>
    </Box>
  )
}

export default LoadingScreen 