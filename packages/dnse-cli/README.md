# dnse-cli

CLI for DNSE API - A Vietnamese securities trading platform.

## Installation

```bash
bun install
```

## Configuration

The CLI requires API credentials to authenticate with the DNSE API. You can provide credentials in three ways (in order of priority):

### 1. Config File (Recommended)

Store credentials locally in `~/.dnse-cli/config.json`:

```bash
bun run index.ts config set --key "your-api-key" --secret "your-api-secret"
# Or run interactively:
bun run index.ts config set
```

View current configuration:
```bash
bun run index.ts config get
```

Clear stored credentials:
```bash
bun run index.ts config clear
```

### 2. Environment Variables

```bash
export DNSE_API_KEY="your-api-key"
export DNSE_API_SECRET="your-api-secret"
```

### 3. Command Line Options

```bash
bun run index.ts --api-key "your-api-key" --api-secret "your-api-secret" <command>
```

## Usage

```bash
bun run index.ts [global-options] [command]
```

### Global Options

| Option | Description |
|--------|-------------|
| `--api-key <key>` | DNSE API key |
| `--api-secret <secret>` | DNSE API secret |
| `--base-url <url>` | DNSE API base URL (default: `https://openapi.dnse.com.vn`) |
| `--debug` | Enable debug mode to see request details |
| `-V, --version` | Output the version number |
| `-h, --help` | Display help for command |

## Commands

### Config

Manage API credentials configuration.

```bash
bun run index.ts config set [--key <key>] [--secret <secret>] [--url <url>]
bun run index.ts config get
bun run index.ts config clear
```

### Account

Account management commands.

```bash
# List all accounts
bun run index.ts account list

# Get account balances
bun run index.ts account balances <accountNo>

# Query loan packages
bun run index.ts account loan-packages <accountNo> <marketType> [--symbol <symbol>]
```

### Trade

Trading operations.

```bash
# Place a new order
bun run index.ts trade order <marketType> <symbol> <side> <orderType> <price> <quantity> <tradingToken> [--price-stop <price>]

# Modify an existing order
bun run index.ts trade modify <accountNo> <orderId> <marketType> <symbol> <side> <orderType> <price> <quantity> <tradingToken> [--price-stop <price>]

# Cancel an order
bun run index.ts trade cancel <accountNo> <orderId> <marketType> <tradingToken>
```

**Parameters:**
- `marketType`: Market type (e.g., `HOSE`, `HNX`, `UPCOM`)
- `symbol`: Stock symbol (e.g., `VIC`, `VCB`)
- `side`: Order side (`buy` or `sell`)
- `orderType`: Order type (e.g., `lo`, `lo_to`, `mp`, `mok`)
- `price`: Order price
- `quantity`: Order quantity
- `tradingToken`: Trading token (obtained via `dnse auth create-token`)

### Order

Order management commands.

```bash
# List current orders
bun run index.ts order list <accountNo> <marketType>

# Get order details
bun run index.ts order detail <accountNo> <orderId> <marketType>

# Get order history
bun run index.ts order history <accountNo> <marketType> [--from <date>] [--to <date>] [--page-size <size>] [--page-index <index>]

# Get executed deals
bun run index.ts order deals <accountNo> <marketType>
```

### Market

Market data commands.

```bash
# Get security definition
bun run index.ts market secdef <symbol> [--board-id <id>]

# Get PPSE (Price Priority Stream Event) data
bun run index.ts market ppse <accountNo> <marketType> <symbol> <price> <loanPackageId>
```

### Auth

Authentication and token management.

```bash
# Send OTP via email
bun run index.ts auth send-otp <email> [--otp-type <type>]

# Create trading token
bun run index.ts auth create-token <otpType> <passcode>
```

### Dry Run

Test commands without making actual API calls.

```bash
bun run index.ts dry-run accounts
bun run index.ts dry-run balances <accountNo>
bun run index.ts dry-run order <marketType> <symbol> <side> <orderType> <price> <quantity> [--price-stop <price>]
```

## Examples

### Setting up credentials
```bash
bun run index.ts config set
```

### Check account balances
```bash
bun run index.ts account balances 123456
```

### Place a buy order
```bash
# First, create a trading token
bun run index.ts auth send-otp user@example.com
# Enter OTP when received
bun run index.ts auth create-token smart_otp YOUR_PASSCODE

# Place the order
bun run index.ts trade order HOSE VIC buy lo 15000 100 YOUR_TRADING_TOKEN
```

### View order history
```bash
bun run index.ts order history 123456 HOSE --from 2025-01-01 --to 2025-01-31 --page-size 50
```

### Debug mode
```bash
# Enable debug to see request details
bun run index.ts --debug account list
```

## Development

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Project Structure

```
dnse-cli/
├── index.ts           # CLI entry point
├── config.ts          # Configuration management
├── commands/          # CLI command modules
│   ├── account.ts
│   ├── auth.ts
│   ├── config.ts
│   ├── dry-run.ts
│   ├── market.ts
│   ├── order.ts
│   ├── trade.ts
│   └── utils.ts
└── sdk/               # DNSE API client
    ├── client.ts
    └── common.ts
```
