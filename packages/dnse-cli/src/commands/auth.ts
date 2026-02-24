import type { Command } from 'commander';
import { createClient, handleApiResponse } from './utils.js';

export function registerAuthCommands(program: Command): void {
  const authCmd = program.command('auth').description('Authentication and token management');

  authCmd
    .command('send-otp <email>')
    .description('Send OTP via email')
    .option('--otp-type <type>', 'OTP type', 'email_otp')
    .action(async (email, options) => {
      const client = createClient(program);
      await handleApiResponse(client.sendEmailOtp(email, { otpType: options.otpType }));
    });

  authCmd
    .command('create-token <otpType> <passcode>')
    .description('Create trading token')
    .action(async (otpType, passcode) => {
      const client = createClient(program);
      await handleApiResponse(client.createTradingToken(otpType, passcode));
    });
}
