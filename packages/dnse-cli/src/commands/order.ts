import type { Command } from 'commander';
import { createClient, handleApiResponse } from './utils.js';

export function registerOrderCommands(program: Command): void {
  const orderCmd = program.command('order').description('Order management commands');

  orderCmd
    .command('list <accountNo> <marketType>')
    .description('List current orders')
    .action(async (accountNo, marketType) => {
      const client = createClient(program);
      await handleApiResponse(client.getOrders(accountNo, marketType));
    });

  orderCmd
    .command('detail <accountNo> <orderId> <marketType>')
    .description('Get order details')
    .action(async (accountNo, orderId, marketType) => {
      const client = createClient(program);
      await handleApiResponse(client.getOrderDetail(accountNo, orderId, marketType));
    });

  orderCmd
    .command('history <accountNo> <marketType>')
    .description('Get order history')
    .option('--from <date>', 'From date (format: YYYY-MM-DD)')
    .option('--to <date>', 'To date (format: YYYY-MM-DD)')
    .option('--page-size <size>', 'Page size', '50')
    .option('--page-index <index>', 'Page index', '0')
    .action(async (accountNo, marketType, options) => {
      const client = createClient(program);
      await handleApiResponse(
        client.getOrderHistory(accountNo, marketType, {
          from: options.from,
          to: options.to,
          pageSize: Number(options.pageSize),
          pageIndex: Number(options.pageIndex),
        })
      );
    });

  orderCmd
    .command('deals <accountNo> <marketType>')
    .description('Get executed deals')
    .action(async (accountNo, marketType) => {
      const client = createClient(program);
      await handleApiResponse(client.getDeals(accountNo, marketType));
    });
}
