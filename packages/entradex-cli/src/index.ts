#!/usr/bin/env bun
import { Command } from 'commander';
import { registerAccountCommands } from './commands/account.js';
import { registerAuthCommands } from './commands/auth.js';
import { registerConfigCommands } from './commands/config.js';
import { registerDryRunCommands } from './commands/dry-run.js';
import { registerMarketCommands } from './commands/market.js';
import { registerOrderCommands } from './commands/order.js';
import { registerTradeCommands } from './commands/trade.js';

const program = new Command();

// Global options
program
  .name('entradex')
  .description('CLI for DNSE EntradeX API')
  .version('1.0.0')
  .option('--api-key <key>', 'DNSE EntradeX API key', process.env.DNSE_API_KEY)
  .option('--api-secret <secret>', 'DNSE EntradeX API secret', process.env.DNSE_API_SECRET)
  .option('--base-url <url>', 'DNSE EntradeX API base URL', 'https://openapi.dnse.com.vn')
  .option('--debug', 'Enable debug mode', false)
  .hook('preAction', (thisCommand) => {
    const options = thisCommand.opts();
    if (options.debug) {
      process.env.DEBUG = 'true';
    }
  });

// Register all command groups
registerConfigCommands(program);
registerAccountCommands(program);
registerTradeCommands(program);
registerOrderCommands(program);
registerMarketCommands(program);
registerAuthCommands(program);
registerDryRunCommands(program);

program.parse();
