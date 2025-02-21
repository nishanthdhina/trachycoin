import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Badge, useColorModeValue } from '@chakra-ui/react'

function TransactionHistory({ transactions }) {
  const textColor = useColorModeValue('gray.800', 'white')
  const headerBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" color={textColor} mb={4}>Transaction History</Heading>
      
      {transactions.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={8}>
          No transactions yet. Start transferring TrachyCoin to see your history!
        </Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr bg={headerBg}>
                <Th color={textColor}>Time</Th>
                <Th color={textColor}>From</Th>
                <Th color={textColor}>To</Th>
                <Th color={textColor}>Amount</Th>
                <Th color={textColor}>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((tx, index) => (
                <Tr key={index} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td color={textColor}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </Td>
                  <Td>
                    <Text color={textColor} isTruncated maxW="150px">
                      {tx.from}
                    </Text>
                  </Td>
                  <Td>
                    <Text color={textColor} isTruncated maxW="150px">
                      {tx.to}
                    </Text>
                  </Td>
                  <Td color={textColor}>
                    <Text fontWeight="bold">{tx.amount} TRCHY</Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={tx.status === 'Success' ? 'green' : 'red'}
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {tx.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </VStack>
  )
}

export default TransactionHistory 