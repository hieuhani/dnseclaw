---
name: entradex
description: Use the EntradeX CLI to interact with DNSE EntradeX API for authentication, account data, market data, orders, and trading operations.
metadata:
  entradex:
    requires:
      bins:
        - entradex
      env:
        - DNSE_API_KEY
        - DNSE_API_SECRET
      files:
        - ~/.entradex-cli/config.json
    install:
      - id: node
        kind: node
        package: entradex-cli
        bins:
          - entradex
          - entradex-cli
        label: Install EntradeX CLI (npm)
---

# EntradeX CLI

Command line interface for the DNSE EntradeX API.

## Usage

```bash
entradex [global-options] [command]
```

Local workspace usage (without global install):

```bash
bun run packages/entradex-cli/src/index.ts [global-options] [command]
```

## Configuration

Credential priority order:

1. Config file (`~/.entradex-cli/config.json`) - recommended
2. Environment variables (`DNSE_API_KEY`, `DNSE_API_SECRET`)
3. Global command options (`--api-key`, `--api-secret`)

Security note:
- This skill may install `entradex-cli` from npm to provide the `entradex` binary.
- Treat `DNSE_API_KEY` and `DNSE_API_SECRET` as sensitive trading credentials.
- Prefer local workspace execution and only use trusted package sources if you choose a global install.

Setup and inspect config:

```bash
entradex config set --key "<api-key>" --secret "<api-secret>"
entradex config set
entradex config get
entradex config clear
```

All command examples below use the `entradex` command name. In this repository,
run the same commands with:

```bash
bun run packages/entradex-cli/src/index.ts <command> [args...]
```

## Global Options

- `--api-key <key>` DNSE API key
- `--api-secret <secret>` DNSE API secret
- `--base-url <url>` API base URL (default: `https://openapi.dnse.com.vn`)
- `--debug` Show request details
- `-V, --version` Show CLI version
- `-h, --help` Show help

## Commands

### Config

```bash
entradex config set [--key <key>] [--secret <secret>] [--url <url>]
entradex config get
entradex config clear
```

### Account

```bash
entradex account list
entradex account balances <accountNo>
entradex account loan-packages <accountNo> <marketType> [--symbol <symbol>]
```

### Trade

```bash
entradex trade order <marketType> <symbol> <side> <orderType> <price> <quantity> <tradingToken> [--price-stop <price>]
entradex trade modify <accountNo> <orderId> <marketType> <symbol> <side> <orderType> <price> <quantity> <tradingToken> [--price-stop <price>]
entradex trade cancel <accountNo> <orderId> <marketType> <tradingToken>
```

Parameters:

- `marketType`: `HOSE`, `HNX`, `UPCOM`
- `side`: `buy`, `sell`
- `orderType`: for example `lo`, `lo_to`, `mp`, `mok`

### Order

```bash
entradex order list <accountNo> <marketType>
entradex order detail <accountNo> <orderId> <marketType>
entradex order history <accountNo> <marketType> [--from <date>] [--to <date>] [--page-size <size>] [--page-index <index>]
entradex order deals <accountNo> <marketType>
```

### Market

```bash
entradex market secdef <symbol> [--board-id <id>]
entradex market ppse <accountNo> <marketType> <symbol> <price> <loanPackageId>
```

### Auth

```bash
entradex auth send-otp <email> [--otp-type <type>]
entradex auth create-token <otpType> <passcode>
```

### Dry Run

```bash
entradex dry-run accounts
entradex dry-run balances <accountNo>
entradex dry-run order <marketType> <symbol> <side> <orderType> <price> <quantity> [--price-stop <price>]
```

## Common Workflow

```bash
# 1) Configure credentials
entradex config set

# 2) Send OTP
entradex auth send-otp user@example.com

# 3) Create trading token with passcode
entradex auth create-token smart_otp <passcode>

# 4) Place an order
entradex trade order HOSE VIC buy lo 15000 100 <trading-token>
```
