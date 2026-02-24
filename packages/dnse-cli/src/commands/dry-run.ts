import type { Command } from 'commander';
import { createClient, handleApiResponse } from './utils.js';

export function registerDryRunCommands(program: Command): void {
  const dryRunCmd = program.command('dry-run').description('Test commands without making actual API calls');

  dryRunCmd
    .command('accounts')
    .description('List accounts (dry run)')
    .action(async () => {
      const client = createClient(program);
      await handleApiResponse(client.getAccounts({ dryRun: true }));
    });

  dryRunCmd
    .command('balances <accountNo>')
    .description('Get balances (dry run)')
    .action(async (accountNo) => {
      const client = createClient(program);
      await handleApiResponse(client.getBalances(accountNo, { dryRun: true }));
    });

  dryRunCmd
    .command('order <marketType> <symbol> <side> <orderType> <price> <quantity>')
    .description('Test placing an order (dry run)')
    .option('--price-stop <price>', 'Stop price')
    .action(async (marketType, symbol, side, orderType, price, quantity, options) => {
      const client = createClient(program);
      const payload = {
        symbol,
        price: Number(price),
        quantity: Number(quantity),
        side,
        orderType,
        ...(options.priceStop && { priceStop: Number(options.priceStop) }),
      };
      await handleApiResponse(client.postOrder(marketType, payload, 'test-token', { dryRun: true }));
    });
}
