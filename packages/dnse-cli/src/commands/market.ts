import type { Command } from 'commander';
import { createClient, handleApiResponse } from './utils.js';

export function registerMarketCommands(program: Command): void {
  const marketCmd = program.command('market').description('Market data commands');

  marketCmd
    .command('secdef <symbol>')
    .description('Get security definition')
    .option('--board-id <id>', 'Board ID')
    .action(async (symbol, options) => {
      const client = createClient(program);
      await handleApiResponse(client.getSecurityDefinition(symbol, { boardId: options.boardId }));
    });

  marketCmd
    .command('ppse <accountNo> <marketType> <symbol> <price> <loanPackageId>')
    .description('Get PPSE (Price Priority Stream Event) data')
    .action(async (accountNo, marketType, symbol, price, loanPackageId) => {
      const client = createClient(program);
      await handleApiResponse(client.getPpse(accountNo, marketType, symbol, Number(price), loanPackageId));
    });
}
