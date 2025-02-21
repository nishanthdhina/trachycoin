# TrachyCoin - Digital Asset Management Platform

A decentralized application for managing TrachyCoin (TRCHY) tokens, built with React, Ethers.js, and Hardhat.

## Features

- Connect with MetaMask wallet
- View TrachyCoin balance
- Transfer tokens to other addresses
- Real-time price chart
- Transaction history
- Dark/Light mode support

## Prerequisites

- Node.js v14+ and npm
- MetaMask browser extension
- Git

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/trachycoin.git
cd trachycoin
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Start the Hardhat node:
```bash
# From the root directory
npx hardhat node --hostname 127.0.0.1
```

4. Deploy the smart contract:
```bash
# In a new terminal
npx hardhat run scripts/deploy.js --network localhost
```

5. Start the frontend development server:
```bash
# In the frontend directory
npm run dev
```

6. Configure MetaMask:
- Network Name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545/`
- Chain ID: `31337`
- Currency Symbol: `ETH`

7. Import the test account:
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## Production Deployment

The frontend can be deployed to Vercel:

1. Fork this repository
2. Connect your fork to Vercel
3. Deploy with the following settings:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist

## License

MIT

## Author

Nishanth Dhina
