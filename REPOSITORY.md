# ATN.fun Repository Overview

## Project Description
ATN.fun is a platform on Solana that tokenizes attention. It allows creators to tokenize their audience's attention, enabling buyers to purchase these tokens for sponsored posts or speculation. The platform operates on a bonding curve mechanism for token trading.
Attention represents the time and mental energy that an audience dedicates to consuming or interacting with content produced by individuals or organizations, such as influencers, content creators, brands, or advertisers.
Humans have limited attention. There is an opportunity cost to the allocation of attention. It is scarce. It is valuable. It's a finite resource—individuals have a limited capacity for attention at any given moment. This scarcity makes attention a valuable commodity in today's information-rich environment.
The tokenization of attention is the representation of attention in a token. The belief that the token holds a certain amount of attention.
ATN.fun allows anyone to tokenize the attention of their audience, allowing anyone buy and speculate on them.
The attention tokens bought can then be used to request for a sponsored post on the creator's social accounts - hence obtaining the attention of their audience.
Buyers of attention can purchase attention tokens to make a request for a sponsored post or the expectation of profiting from the appreciation of the attention tokens - speculation on the growth of the creator's audience.
Creators can sell their attention tokens via a bonding curve.
When a request is made, the creator can choose to accept the request. Accepting it will burn the attention tokens via the same bonding curve and the funds will be deposited into the creator's account.

## Technology Stack
- **Frontend Framework**: Next.js with TypeScript
- **UI Components**: Shadcn
- **Styling**: Tailwind CSS
- **Blockchain**: Solana (Web3.js)
- **RPC Provider**: Helius

## Directory Structure

```
atn-frontend/
├── src/                      # Main source code directory
│   ├── app/                  # Next.js app directory (pages and routes)
│   ├── components/           # Reusable UI components
│   └── lib/                  # Utility functions and shared logic
├── public/                   # Static assets
├── .next/                    # Next.js build output
└── node_modules/             # Dependencies
```

## Key Configuration Files
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - Shadcn UI configuration
- `next.config.ts` - Next.js configuration

## Main Pages

1. **Markets (Home)**
   - Displays all attention token markets
   - Features table with market data
   - Search and filter functionality

2. **Create**
   - Token creation interface
   - Configure token parameters
   - Set request options

3. **Manage**
   - Creator dashboard
   - Earnings management
   - Request handling

4. **Pair**
   - Token pair trading interface
   - Price charts
   - Buy/Sell functionality

5. **Request**
   - Sponsored post request interface
   - Request management
   - Transaction history

## Key Features
- Attention token creation and management
- Bonding curve-based token trading
- Sponsored post request system
- Token price and market analytics
- Creator earnings management

## Development Guidelines
- Built with TypeScript for type safety
- Uses Next.js App Router
- Implements Shadcn UI components
- Follows Tailwind CSS styling patterns
- Integrates with Solana blockchain

## Smart Contract Integration
The frontend interacts with Solana smart contracts for:
- Token creation and management
- Trading operations
- Request handling
- Creator earnings distribution

## Implementation Status

### Completed Features
- Basic project setup and configuration
- Next.js app structure with TypeScript
- Tailwind CSS and Shadcn UI integration
- Navbar and layout setup

#### Markets Page
- [x] Market data table implementation with sorting and filtering
- [x] Mock data integration for development
- [x] Table columns setup (Pair info, Market Cap, Price, etc.)

#### Create Page
- [x] Token creation form UI
- [x] Token parameter configuration interface
- [x] Request options setup UI
- [x] Social media handle inputs
- [x] Base price and price change inputs

#### Pair Page
- [x] Dynamic routing based on token address
- [x] Basic page structure
- [x] Component organization

### In Progress Features

#### Markets Page
- [ ] Live market data integration with Solana
- [ ] Quick buy action implementation
- [ ] Search functionality refinement

#### Create Page
- [ ] Token image upload functionality
- [ ] Smart contract integration for token creation
- [ ] Form validation and error handling

#### Manage Page
- [ ] Creator dashboard UI
- [ ] Earnings display and management
- [ ] Request handling interface
- [ ] Claims functionality
- [ ] Transaction history table

#### Pair Page
- [ ] Price chart implementation
- [ ] Buy/Sell interface
- [ ] Token information display
- [ ] Transaction history
- [ ] Market statistics
- [ ] Request button integration

#### Request Page
- [ ] Request creation interface
- [ ] Request options display
- [ ] Request status tracking
- [ ] Withdrawal functionality
- [ ] Transaction history table

#### Smart Contract Integration
- [ ] Solana wallet connection
- [ ] Token creation and management
- [ ] Trading operations
- [ ] Request handling
- [ ] Creator earnings distribution

#### General Features
- [ ] Wallet integration
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsiveness
- [ ] User authentication
- [ ] Transaction notifications

## Navigation for LLMs
When working with this codebase:
1. Main application logic is in `src/app`
2. Reusable components are in `src/components`
3. Utility functions are in `src/lib`
4. Page implementations follow Next.js App Router structure
5. UI components use Shadcn and Tailwind CSS
6. Blockchain interactions are handled through Web3.js 