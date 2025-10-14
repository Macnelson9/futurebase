# FutureBase

FutureBase is a decentralized platform that enables users to send encrypted messages to their future selves, securely stored on the blockchain. By combining advanced encryption, decentralized storage, and smart contract technology, FutureBase preserves personal thoughts, dreams, and important moments that unlock at predetermined future dates.

## Overview

The platform allows users to create time capsules containing personal messages that remain encrypted and inaccessible until their specified unlock date. Messages are encrypted using military-grade AES-GCM encryption, stored on IPFS for decentralization, and their metadata is recorded on the blockchain for immutability and transparency.

## Features

- **Secure Message Creation**: Write encrypted letters with custom unlock dates and times
- **Blockchain Storage**: Immutable record of letter metadata on Ethereum-compatible networks
- **Decentralized Content Storage**: Encrypted message content stored on IPFS
- **Wallet Integration**: Support for Coinbase Wallet, MetaMask, and WalletConnect
- **User Dashboard**: Comprehensive interface for managing letters and viewing statistics
- **Time-Based Access Control**: Messages automatically become available at specified future dates
- **Cross-Platform Compatibility**: Web-based application with responsive design

## Technology Stack

### Frontend

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom theming
- **Animations**: Framer Motion for smooth interactions
- **3D Graphics**: Three.js with React Three Fiber for visual effects

### Blockchain & Web3

- **Smart Contracts**: Solidity ^0.8.30
- **Libraries**: OpenZeppelin contracts (Ownable, ReentrancyGuard)
- **Networks**: Base Sepolia (testnet) and Base (mainnet)
- **Web3 Integration**: Wagmi and Viem for wallet connections and contract interactions
- **Identity**: Coinbase OnchainKit for user profiles and basenames

### Storage & Security

- **Decentralized Storage**: IPFS via Pinata SDK
- **Encryption**: AES-GCM encryption using Web Crypto API
- **Key Derivation**: PBKDF2 with wallet address as entropy source

### Development Tools

- **Build System**: Next.js with custom configuration
- **Linting**: ESLint with TypeScript support
- **Styling Processing**: PostCSS with Tailwind CSS
- **Package Management**: npm/pnpm with lockfile management

## Architecture

### Project Structure

```
futurebase-fe/
├── app/                    # Next.js app router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── dashboard/         # User dashboard
│   ├── letters/           # Letters management
│   ├── time-travel/       # Main letter creation interface
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── gl/               # 3D graphics components
│   └── ...               # Feature-specific components
├── contract/             # Smart contract source code
│   └── src/
│       └── futureBase.sol # Main smart contract
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
├── services/             # External service integrations
└── public/               # Static assets
```

### Smart Contract

The FutureBase smart contract manages letter creation, storage, and retrieval:

**Key Functions:**

- `createLetter(string _ipfsHash, uint256 _releaseTime)`: Creates a new letter with encrypted content hash and unlock timestamp
- `claimLetter(uint256 _letterId)`: Claims and returns IPFS hash for available letters
- `getLetter(uint256 _letterId)`: Retrieves letter metadata with access-controlled content hash
- `getUserLetter(address _user)`: Returns array of letter IDs owned by user

**Security Features:**

- Reentrancy protection using OpenZeppelin's ReentrancyGuard
- Owner-only administrative functions
- Input validation for release times and IPFS hashes
- Access control for letter content based on ownership and timing

### Encryption Flow

1. **Key Generation**: Encryption key derived from user's wallet address using PBKDF2
2. **Content Encryption**: Message content encrypted with AES-GCM using generated key
3. **IPFS Storage**: Encrypted content uploaded to IPFS, receiving a content hash
4. **Blockchain Record**: Letter metadata (IPFS hash, unlock time) stored on smart contract
5. **Decryption**: At unlock time, content retrieved from IPFS and decrypted using same key derivation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd futurebase-fe
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
   Create `.env.local` with required configuration:

```env
NEXT_PUBLIC_GATEWAY_URL=your-ipfs-gateway-url
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Smart Contract Deployment

1. Navigate to the contract directory:

```bash
cd contract
```

2. Install Foundry (if not already installed):

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

3. Install dependencies:

```bash
forge install
```

4. Deploy to testnet:

```bash
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
```

## Usage

### Creating a Letter

1. Connect your wallet using Coinbase Wallet, MetaMask, or WalletConnect
2. Navigate to the Time Travel page
3. Enter recipient email address
4. Write your message content
5. Select unlock date and time
6. Submit the letter (requires gas fee for blockchain transaction)

### Viewing Letters

1. Access your dashboard to view letter statistics
2. Navigate to the Time Travel page to see individual letters
3. Letters become available when their unlock time is reached
4. Click "Reveal Letter" to decrypt and view content

## API Reference

### Smart Contract Events

- `LetterCreated(uint256 indexed letterId, address indexed owner, string ipfsHash, uint256 releaseTime)`
- `LetterClaimed(uint256 indexed letterId, address indexed owner, uint256 releasedTime)`
- `PlatformFeeUpdated(uint256 indexed newFeeBps)`
- `TreasuryUpdated(address indexed newTreasury)`

### React Hooks

- `useFutureBaseContract()`: Contract interaction functions
- `useIPFS()`: IPFS upload and retrieval operations
- `useEncryption()`: Message encryption and decryption utilities

## Security Considerations

- **Encryption**: AES-GCM with 256-bit keys derived from wallet addresses
- **Access Control**: Smart contract enforces ownership and timing restrictions
- **Input Validation**: Comprehensive validation of user inputs and contract parameters
- **Reentrancy Protection**: OpenZeppelin guards prevent reentrancy attacks
- **Immutability**: Blockchain ensures letter metadata cannot be altered

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and ensure tests pass
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Email: hello@futurebase.com
- Twitter: @futurebase
- Discord: FutureBase Community

## Roadmap

- Mobile application development
- Multi-chain support expansion
- Advanced encryption options
- Social features for shared time capsules
- Integration with additional decentralized storage solutions
