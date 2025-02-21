import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Image,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import TransactionHistory from './TransactionHistory'
import LoadingScreen from './LoadingScreen'
import PriceChart from './PriceChart'

const TRACHYCOIN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const DEPLOYER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const TRACHYCOIN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
]

function App() {
  // Chakra UI hooks and theme values
  const toast = useToast()
  const { colorMode, toggleColorMode } = useColorMode()
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.100, purple.100)',
    'linear(to-r, blue.900, purple.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const inputBg = useColorModeValue('white', 'gray.700')
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.400')
  const subtitleColor = useColorModeValue('gray.500', 'gray.400')

  // State hooks
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [balance, setBalance] = useState('0')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [transactions, setTransactions] = useState([])
  const [userAddress, setUserAddress] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isContractDeployed, setIsContractDeployed] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  const checkContractDeployment = async (provider) => {
    try {
      const code = await provider.getCode(TRACHYCOIN_ADDRESS)
      const isDeployed = code !== '0x'
      console.log('Contract deployment check:', { address: TRACHYCOIN_ADDRESS, code, isDeployed })
      return isDeployed
    } catch (error) {
      console.error('Error checking contract:', error)
      return false
    }
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true)
        
        // Request account access first
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const network = await provider.getNetwork()
        console.log('Connected to network:', network)

        // Check if we're on the correct network (Hardhat's chainId is 31337)
        if (network.chainId !== 31337) {
          toast({
            title: 'Wrong Network',
            description: 'Please connect to the Hardhat network (Chain ID: 31337)',
            status: 'error',
            duration: null,
            isClosable: true,
          })
          setIsLoading(false)
          return
        }
        
        // Check if the contract is deployed
        const isDeployed = await checkContractDeployment(provider)
        setIsContractDeployed(isDeployed)
        
        if (!isDeployed) {
          toast({
            title: 'Contract Not Found',
            description: 'Please make sure the TrachyCoin contract is deployed to the correct address and you are on the correct network.',
            status: 'error',
            duration: null,
            isClosable: true,
          })
          setIsLoading(false)
          return
        }

        const signer = provider.getSigner()
        const contract = new ethers.Contract(TRACHYCOIN_ADDRESS, TRACHYCOIN_ABI, signer)
        
        setProvider(provider)
        setSigner(signer)
        setContract(contract)

        // Get initial balance and address
        const address = await signer.getAddress()
        setUserAddress(address)
        const balance = await contract.balanceOf(address)
        setBalance(ethers.utils.formatUnits(balance, 18))

        toast({
          title: 'Connected to MetaMask',
          description: 'Successfully connected to your wallet',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } catch (error) {
        console.error('Connection error:', error)
        toast({
          title: 'Error connecting to MetaMask',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: 'MetaMask not found',
        description: 'Please install MetaMask to use this dApp!',
        status: 'warning',
        duration: null,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    connectWallet()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        connectWallet()
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', connectWallet)
      }
    }
  }, [])

  const handleTransfer = async () => {
    if (!contract || !recipientAddress || !amount) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const tx = await contract.transfer(
        recipientAddress,
        ethers.utils.parseUnits(amount, 18)
      )
      
      toast({
        title: 'Transaction Sent',
        description: 'Please wait for confirmation...',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })

      const receipt = await tx.wait()
      
      // Add transaction to history
      const newTransaction = {
        timestamp: Date.now(),
        from: userAddress,
        to: recipientAddress,
        amount: amount,
        status: 'Success',
      }
      setTransactions([newTransaction, ...transactions])

      // Update balance
      const newBalance = await contract.balanceOf(userAddress)
      setBalance(ethers.utils.formatUnits(newBalance, 18))

      toast({
        title: 'Transfer successful!',
        description: `Transferred ${amount} TRCHY to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setRecipientAddress('')
      setAmount('')
    } catch (error) {
      toast({
        title: 'Transfer failed',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })

      // Add failed transaction to history
      const newTransaction = {
        timestamp: Date.now(),
        from: userAddress,
        to: recipientAddress,
        amount: amount,
        status: 'Failed',
      }
      setTransactions([newTransaction, ...transactions])
    }
  }

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box bgGradient={bgGradient} minH="100vh" py={8}>
          <Container maxW="container.xl">
            <Box position="fixed" top="4" right="4" zIndex="docked">
              <IconButton
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                colorScheme="blue"
                aria-label="Toggle color mode"
                size="lg"
                _hover={{ bg: buttonHoverBg, color: 'white' }}
              />
            </Box>
            <VStack spacing={8}>
              <Card w="full" variant="elevated" bg={cardBg} shadow="xl">
                <CardBody>
                  <VStack spacing={6}>
                    <Box
                      position="relative"
                      w="full"
                      display="flex"
                      justifyContent="center"
                      py={4}
                    >
                      <Image
                        src="/assets/trachycoinlogo.png"
                        alt="TrachyCoin Logo"
                        boxSize="150px"
                        shadow="2xl"
                        fallback={<Spinner size="xl" />}
                      />
                    </Box>
                    <VStack spacing={2}>
                      <Heading size="xl" color={textColor}>TrachyCoin Dashboard</Heading>
                      <Text color={subtitleColor} fontSize="lg">Your Digital Asset Management Platform By Nishanth Dhina</Text>
                    </VStack>
                    
                    {!isContractDeployed && (
                      <Alert status="error" borderRadius="lg">
                        <AlertIcon />
                        Contract not deployed. Please make sure you are connected to the Hardhat network and the contract is deployed.
                      </Alert>
                    )}
                    
                    {userAddress && userAddress.toLowerCase() !== DEPLOYER_ADDRESS.toLowerCase() && (
                      <Alert status="warning" borderRadius="lg">
                        <AlertIcon />
                        You are not using the account that has TrachyCoin. To get TrachyCoin, import Account #0 using private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
                      </Alert>
                    )}
                    
                    {!userAddress && !isLoading && (
                      <Button
                        colorScheme="blue"
                        onClick={connectWallet}
                        size="lg"
                        shadow="md"
                        _hover={{ transform: 'translateY(-2px)', shadow: 'lg', bg: buttonHoverBg }}
                        transition="all 0.2s"
                      >
                        Connect Wallet
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              <Box width="full">
                <Tabs 
                  variant="soft-rounded" 
                  colorScheme="blue"
                  index={selectedTab} 
                  onChange={setSelectedTab}
                  isFitted
                >
                  <TabList bg={cardBg} p={2} borderRadius="lg" mb={4}>
                    <Tab 
                      isDisabled={!userAddress || !isContractDeployed}
                      _selected={{ bg: 'blue.500', color: 'white' }}
                    >
                      Dashboard
                    </Tab>
                    <Tab 
                      isDisabled={!userAddress || !isContractDeployed}
                      _selected={{ bg: 'blue.500', color: 'white' }}
                    >
                      Transaction History
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <VStack spacing={6}>
                        <Card w="full" bg={cardBg} shadow="lg">
                          <CardBody>
                            <Stat>
                              <StatLabel fontSize="xl" color={textColor}>Your Balance</StatLabel>
                              <StatNumber fontSize="4xl" color="blue.500" fontWeight="bold">
                                {balance} TRCHY
                              </StatNumber>
                              <StatHelpText fontSize="md" color={subtitleColor}>
                                Address: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Not Connected'}
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <PriceChart />

                        <Card w="full" bg={cardBg} shadow="lg">
                          <CardBody>
                            <VStack spacing={6}>
                              <Heading size="md" color={textColor}>Transfer TrachyCoin</Heading>
                              <Input
                                placeholder="Recipient Address (0x...)"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                isDisabled={!isContractDeployed}
                                size="lg"
                                bg={inputBg}
                              />
                              <Input
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                isDisabled={!isContractDeployed}
                                size="lg"
                                bg={inputBg}
                              />
                              <Button
                                colorScheme="blue"
                                onClick={handleTransfer}
                                width="full"
                                size="lg"
                                isDisabled={!isContractDeployed}
                                shadow="md"
                                _hover={{ transform: 'translateY(-2px)', shadow: 'lg', bg: buttonHoverBg }}
                                transition="all 0.2s"
                              >
                                Transfer
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <Card bg={cardBg} shadow="lg">
                        <CardBody>
                          <TransactionHistory transactions={transactions} />
                        </CardBody>
                      </Card>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </VStack>
          </Container>
        </Box>
      )}
    </>
  )
}

export default App
