import type { Command } from 'commander';
import * as readline from 'node:readline';
import { clearConfig, getConfig, setConfig } from '../config.js';

export function registerConfigCommands(program: Command): void {
  const configCmd = program.command('config').description('Configuration management');

  configCmd
    .command('set')
    .description('Set API credentials (saved to ~/.entradex-cli/config.json)')
    .option('--key <key>', 'DNSE EntradeX API key')
    .option('--secret <secret>', 'DNSE EntradeX API secret')
    .option('--url <url>', 'DNSE EntradeX API base URL')
    .action(async (options) => {
      const config: Record<string, string> = {};

      // If options provided, use them; otherwise prompt
      if (options.key && options.key !== '') {
        config.apiKey = options.key;
      } else {
        config.apiKey = await promptInput('Enter API Key: ');
      }

      if (options.secret && options.secret !== '') {
        config.apiSecret = options.secret;
      } else {
        config.apiSecret = await promptInput('Enter API Secret: ');
      }

      if (options.url) {
        config.baseUrl = options.url;
      }

      const updated = setConfig(config);
      console.log('Configuration saved to:', configPath());
      console.log('Current config:');
      console.log(
        JSON.stringify(
          { apiKey: maskKey(updated.apiKey), apiSecret: maskKey(updated.apiSecret), baseUrl: updated.baseUrl },
          null,
          2
        )
      );
    });

  configCmd
    .command('get')
    .description('Show current configuration')
    .action(() => {
      const config = getConfig();
      console.log('Current configuration:');
      console.log(
        JSON.stringify(
          {
            apiKey: config.apiKey ? maskKey(config.apiKey) : '(not set)',
            apiSecret: config.apiSecret ? maskKey(config.apiSecret) : '(not set)',
            baseUrl: config.baseUrl,
          },
          null,
          2
        )
      );
      console.log('\nConfig file:', configPath());
    });

  configCmd
    .command('clear')
    .description('Clear API credentials from config')
    .action(() => {
      clearConfig();
      console.log('Configuration cleared');
      console.log('Config file:', configPath());
    });
}

function promptInput(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function maskKey(key?: string): string {
  if (!key) return '(not set)';
  if (key.length <= 8) return '*'.repeat(key.length);
  return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
}

function configPath(): string {
  const { homedir } = require('node:os');
  const { join } = require('node:path');
  return join(homedir(), '.entradex-cli', 'config.json');
}
