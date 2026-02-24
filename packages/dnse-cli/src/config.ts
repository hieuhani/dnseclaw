import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface CliConfig {
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
}

const CONFIG_DIR = join(homedir(), ".dnse-cli");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const DEFAULT_API_URL = "https://openapi.dnse.com.vn";

export function getConfig(): CliConfig {
  const defaults: CliConfig = { baseUrl: DEFAULT_API_URL };
  if (!existsSync(CONFIG_FILE)) {
    return defaults;
  }
  try {
    const content = readFileSync(CONFIG_FILE, "utf-8");
    const config = JSON.parse(content) as CliConfig;
    return { ...defaults, ...config };
  } catch {
    return defaults;
  }
}

export function setConfig(config: Partial<CliConfig>): CliConfig {
  const current = getConfig();
  const updated = { ...current, ...config };
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2));
  return updated;
}

export function clearConfig(): void {
  if (existsSync(CONFIG_FILE)) {
    writeFileSync(CONFIG_FILE, JSON.stringify({ baseUrl: DEFAULT_API_URL }, null, 2));
  }
}
