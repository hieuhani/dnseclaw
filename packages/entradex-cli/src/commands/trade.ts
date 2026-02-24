import type { Command } from 'commander';
import { createClient, handleApiResponse } from './utils.js';

export function registerTradeCommands(program: Command): void {
  const tradeCmd = program.command('trade').description('Trading operations');

  tradeCmd
    .command('order <marketType> <symbol> <side> <orderType> <price> <quantity> <tradingToken>')
    .description('Place a new order')
    .option('--price-stop <price>', 'Stop price (for conditional orders)')
    .action(async (marketType, symbol, side, orderType, price, quantity, tradingToken, options) => {
      const client = createClient(program);
      const payload = {
        symbol,
        price: Number(price),
        quantity: Number(quantity),
        side,
        orderType,
        ...(options.priceStop && { priceStop: Number(options.priceStop) }),
      };
      await handleApiResponse(client.postOrder(marketType, payload, tradingToken));
    });

  tradeCmd
    .command('modify <accountNo> <orderId> <marketType> <symbol> <side> <orderType> <price> <quantity> <tradingToken>')
    .description('Modify an existing order')
    .option('--price-stop <price>', 'Stop price (for conditional orders)')
    .action(
      async (accountNo, orderId, marketType, symbol, side, orderType, price, quantity, tradingToken, options) => {
        const client = createClient(program);
        const payload = {
          symbol,
          price: Number(price),
          quantity: Number(quantity),
          side,
          orderType,
          ...(options.priceStop && { priceStop: Number(options.priceStop) }),
        };
        await handleApiResponse(client.putOrder(accountNo, orderId, marketType, payload, tradingToken));
      }
    );

  tradeCmd
    .command('cancel <accountNo> <orderId> <marketType> <tradingToken>')
    .description('Cancel an order')
    .action(async (accountNo, orderId, marketType, tradingToken) => {
      const client = createClient(program);
      await handleApiResponse(client.cancelOrder(accountNo, orderId, marketType, tradingToken));
    });
}
