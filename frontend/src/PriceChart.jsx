import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  useColorModeValue,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Simulate price data
const generateInitialData = () => {
  const basePrice = 2.5 // Base price in USD
  const points = 24 // 24 hours
  const data = []
  const labels = []
  
  for (let i = points - 1; i >= 0; i--) {
    const variation = Math.random() * 0.4 - 0.2 // Random variation between -0.2 and 0.2
    const price = basePrice + variation
    data.push(price)
    labels.push(`${i}h`)
  }
  
  return { data, labels }
}

function PriceChart() {
  const [priceData, setPriceData] = useState(generateInitialData())
  const [currentPrice, setCurrentPrice] = useState(priceData.data[priceData.data.length - 1])
  const [priceChange, setPriceChange] = useState(0)
  const lineColor = useColorModeValue('rgba(49, 130, 206, 1)', 'rgba(99, 179, 237, 1)')
  const fillColor = useColorModeValue('rgba(49, 130, 206, 0.1)', 'rgba(99, 179, 237, 0.1)')
  const textColor = useColorModeValue('gray.800', 'white')
  const cardBg = useColorModeValue('white', 'gray.800')

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  }

  const chartData = {
    labels: priceData.labels,
    datasets: [
      {
        data: priceData.data,
        fill: true,
        backgroundColor: fillColor,
        borderColor: lineColor,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: lineColor,
      },
    ],
  }

  useEffect(() => {
    // Update price every 30 seconds
    const interval = setInterval(() => {
      const newPriceData = { ...priceData }
      const lastPrice = newPriceData.data[newPriceData.data.length - 1]
      const variation = Math.random() * 0.4 - 0.2
      const newPrice = lastPrice + variation
      
      newPriceData.data = [...newPriceData.data.slice(1), newPrice]
      setPriceData(newPriceData)
      setCurrentPrice(newPrice)
      setPriceChange((newPrice - lastPrice) / lastPrice * 100)
    }, 30000)

    return () => clearInterval(interval)
  }, [priceData])

  return (
    <Card w="full" bg={cardBg} shadow="lg">
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                TrachyCoin Price Chart
              </Text>
              <Text fontSize="sm" color="gray.500">
                24-hour price history
              </Text>
            </VStack>
            <VStack align="end" spacing={0}>
              <Stat>
                <StatLabel>Current Price</StatLabel>
                <StatNumber fontSize="2xl" color={textColor}>
                  ${currentPrice.toFixed(2)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={priceChange >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(priceChange).toFixed(2)}%
                </StatHelpText>
              </Stat>
            </VStack>
          </HStack>
          
          <Box h="300px">
            <Line options={chartOptions} data={chartData} />
          </Box>

          <HStack justify="space-between" mt={4}>
            <Stat>
              <StatLabel>USD</StatLabel>
              <StatNumber fontSize="xl" color={textColor}>
                ${currentPrice.toFixed(2)}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>EUR</StatLabel>
              <StatNumber fontSize="xl" color={textColor}>
                €{(currentPrice * 0.91).toFixed(2)}
              </StatNumber>
            </Stat>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default PriceChart 