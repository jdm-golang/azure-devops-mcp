import fs from "fs/promises";
import path from "path";
import { transportProviders } from "./index.js";

export async function initTransport(): Promise<any> {
  const configRaw = await fs.readFile(path.resolve("mcp.json"), "utf-8");
  const config = JSON.parse(configRaw);

  const [firstServerKey] = Object.keys(config.servers ?? {});
  const serverConfig = config.servers[firstServerKey];

  if (!serverConfig || typeof serverConfig !== "object" || !("type" in serverConfig)) {
    throw new Error("Invalid server config: missing 'type'");
  }

  const { type } = serverConfig;

  const provider = transportProviders.find(p => p.supports(type));
  if (!provider) {
    throw new Error(`No transport provider found for type "${type}"`);
  }

  return provider.create({});
}
