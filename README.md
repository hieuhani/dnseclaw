# dnseclaw

`dnseclaw` is a Bun/TypeScript monorepo for tooling around DNSE EntradeX, focused on a command-line interface for account, market data, authentication, and order/trade workflows.

## What This Project Contains

- `packages/entradex-cli`: A CLI client for the DNSE EntradeX Open API.
- `skills/entradex/SKILL.md`: An Agent Skill definition for using EntradeX workflows through Codex-compatible agents.
- Workspace setup with shared root scripts for building packages.

## Why This Project Exists

This project provides a practical developer/operator interface to DNSE EntradeX so you can:

- manage API credentials and configuration
- query accounts, balances, orders, and market data
- authenticate and create trading tokens
- place, modify, and cancel trades from the terminal

## Quick Start

```bash
# install dependencies
bun install

# build workspace packages
bun run build

# enter CLI package
cd packages/entradex-cli

# show CLI help
bun run src/index.ts --help
```

## Main Package

See `packages/entradex-cli/README.md` for full command reference and examples.

## Agent Skills

This repository also includes an EntradeX Agent Skill:

- `skills/entradex/SKILL.md`

The skill defines command patterns, configuration flow, and common operational workflows so an AI agent can execute EntradeX tasks consistently.
