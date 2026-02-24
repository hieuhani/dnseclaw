import type { Command } from 'commander';
import { createClient, handleApiResponse } from './utils.js';

export function registerAccountCommands(program: Command): void {
  const accountCmd = program.command('account').description('Account management commands');

  accountCmd
    .command('list')
    .description('List all accounts')
    .action(async () => {
      const client = createClient(program);
      await handleApiResponse(client.getAccounts());
    });

  accountCmd
    .command('balances <accountNo>')
    .description('Get account balances')
    .action(async (accountNo) => {
      const client = createClient(program);
      await handleApiResponse(client.getBalances(accountNo));
    });

  accountCmd
    .command('loan-packages <accountNo> <marketType>')
    .description('Query loan packages')
    .option('--symbol <symbol>', 'Filter by symbol')
    .action(async (accountNo, marketType, options) => {
      const client = createClient(program);
      await handleApiResponse(
        client.getLoanPackages(accountNo, marketType, { symbol: options.symbol })
      );
    });
}
