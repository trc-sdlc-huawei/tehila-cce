import fs from 'fs';

const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
const SHOULD_LOG = !!LOG_FILE_PATH;

function writeLog(message: string) {
  if (!SHOULD_LOG) return;
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE_PATH!, `[${timestamp}] ${message}\n`);
}

export function logHttpRequest(
  method: string,
  url: string,
  headers?: Record<string, string>,
  body?: any,
  queryParams?: Record<string, any>
) {
  writeLog(`[HTTP REQUEST] ${method} ${url}`);
  if (headers) {
    writeLog(`  Headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (queryParams) {
    writeLog(`  Query Params: ${JSON.stringify(queryParams, null, 2)}`);
  }
  if (body) {
    writeLog(`  Body: ${JSON.stringify(body, null, 2)}`);
  }
}

export function logHttpResponse(
  status: number,
  headers?: Record<string, string>,
  body?: any,
  duration?: number
) {
  const statusText = status < 400 ? 'SUCCESS' : 'ERROR';
  writeLog(`[HTTP RESPONSE] Status: ${status} (${statusText})`);
  if (duration) {
    writeLog(`  Duration: ${duration}ms`);
  }
  if (headers) {
    writeLog(`  Headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (body) {
    writeLog(`  Body: ${JSON.stringify(body, null, 2)}`);
  }
}

export function logMcpUsage({ tool, args, result, error }: { tool: string, args: any, result?: any, error?: any }) {
  if (error) {
    writeLog(`[MCP ERROR] Tool: ${tool} | Args: ${JSON.stringify(args)} | Error: ${error}`);
  } else {
    writeLog(`[MCP USAGE] Tool: ${tool} | Args: ${JSON.stringify(args)} | Result: ${result ? JSON.stringify(result).slice(0, 300) : ''}`);
  }
}

export function logInfo(message: string) {
  writeLog(`[INFO] ${message}`);
}

export function logError(message: string) {
  writeLog(`[ERROR] ${message}`);
}
