---
name: entradex
description: Use the EntradeX CLI for DNSE workflows. Use when (1) setting DNSE API credentials via env vars or config file, (2) reading account, market, and order data, (3) placing, modifying, or canceling real trades.
metadata:
  entradex:
    requires:
      bins:
        - entradex
        - entradex-cli
      env:
        - DNSE_API_KEY
        - DNSE_API_SECRET
    install:
      - kind: node
        package: entradex-cli
        bins:
          - entradex
        label: Install EntradeX CLI (npm)
    homepage: https://www.npmjs.com/package/entradex-cli
---

# EntradeX CLI

Install

```bash
npm i -g entradex-cli
```

## Usage

```bash
entradex [global-options] [command]
```

## Configuration

Credential priority order:

1. Config file (`~/.entradex-cli/config.json`) - recommended
2. Environment variables (`DNSE_API_KEY`, `DNSE_API_SECRET`)
3. Global command options (`--api-key`, `--api-secret`)

Setup and inspect config:

```bash
entradex config set --key "<api-key>" --secret "<api-secret>"
entradex config set
entradex config get
entradex config clear
```

## Security & Safety

**Before using this skill:**

- Verify the npm package: `npm view entradex-cli` - check author is `hieuhani` and repository matches
- Inspect package contents: `npm pack entradex-cli --dry-run` or view on [npmjs.com](https://www.npmjs.com/package/entradex-cli)
- Treat `DNSE_API_KEY` and `DNSE_API_SECRET` as highly sensitive trading credentials

**Autonomous execution warning:**

- This skill can place **real trades** using provided credentials
- Consider using a separate limited-permission account
- Rotate API keys if you suspect unauthorized access

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

- `marketType`: `STOCK`, `DERIVATIVE`
- `side`: `NB`, `NS`
- `orderType`: for example `ATO`, `ATC`, `LO`, `MTL`, `MOK`, `ATC`, `PLO`

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
entradex trade order STOCK VIC buy lo 15000 100 <trading-token>
```
