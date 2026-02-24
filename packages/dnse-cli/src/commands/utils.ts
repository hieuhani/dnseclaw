import type { Command } from 'commander';
import { DNSEClient } from '../sdk/client.js';
import { getConfig } from '../config.js';

export function createClient(program: Command): DNSEClient {
  const options = program.opts();
  const fileConfig = getConfig();

  // Priority: CLI options > Environment variables > Config file
  const apiKey = (options.apiKey as string) || process.env.DNSE_API_KEY || fileConfig.apiKey;
  const apiSecret = (options.apiSecret as string) || process.env.DNSE_API_SECRET || fileConfig.apiSecret;
  const baseUrl = (options.baseUrl as string) || fileConfig.baseUrl;

  if (!apiKey || !apiSecret) {
    console.error(
      'Error: API key and secret are required.\n' +
      'Set them using:\n' +
      '  1. "dnse config set" (saved to ~/.dnse-cli/config.json)\n' +
      '  2. DNSE_API_KEY and DNSE_API_SECRET environment variables\n' +
      '  3. --api-key and --api-secret options'
    );
    process.exit(1);
  }

  return new DNSEClient({ apiKey, apiSecret, baseUrl });
}

export async function handleApiResponse(
  call: Promise<{ status: number | null; body: string | null }>
): Promise<void> {
  try {
    const response = await call;
    if (response.body) {
      console.log(response.body);
    } else {
      console.log(JSON.stringify({ status: response.status, body: response.body }));
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
