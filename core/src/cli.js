#!/usr/bin/env node

import { GitScanner } from './scanner/git.js';

// ANSI Terminal Colors
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'scan';

  console.log(`
${C.bold}${C.red}🛡️ SecretArmor v1.0.0${C.reset} ${C.dim}- Zero-Trust Secret Sprawl & API Key Leak Firewall${C.reset}
${C.dim}Organization: 1nsharma-labs | https://github.com/1nsharma-labs/secretarmor${C.reset}
`);

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  // 1. Install Hook Command
  if (command === 'install-hook') {
    try {
      const scanner = new GitScanner();
      const hookPath = scanner.installHook();
      console.log(`${C.green}✔ Pre-commit hook installed successfully!${C.reset}`);
      console.log(`Location: ${hookPath}`);
      console.log(`Your repository is now protected from accidental API key leaks before every git commit.`);
    } catch (err) {
      console.error(`${C.red}Error:${C.reset} ${err.message}`);
      process.exit(1);
    }
    return;
  }

  // 2. Scan Command
  if (command === 'scan') {
    const isStaged = args.includes('--staged');
    console.log(`${C.cyan}🔍 Scanning ${isStaged ? 'git staged diff' : 'repository files'} for API keys & credentials...${C.reset}\n`);

    const scanner = new GitScanner();
    const result = isStaged ? scanner.scanStaged() : scanner.scanDirectory();

    console.log(`Scanned: ${result.scannedCount} files`);
    console.log(`Leaks Detected: ${result.findings.length > 0 ? C.red : C.green}${C.bold}${result.findings.length}${C.reset}\n`);

    if (result.findings.length === 0) {
      console.log(`${C.green}✔ Clean! No credentials, API keys, or private secrets found.${C.reset}\n`);
      process.exit(0);
    }

    console.log(`${C.bold}${C.red}CRITICAL: Leaked Secrets Detected!${C.reset}`);
    for (const f of result.findings) {
      console.log(`  ${C.red}[${f.severity}]${C.reset} ${C.bold}${f.name}${C.reset} in ${f.filename}:${f.line}`);
      console.log(`        Masked Secret: ${C.yellow}${f.masked}${C.reset}`);
    }

    console.log(`\n${C.yellow}Action Required: Remove secrets before committing. Use environment variables instead.${C.reset}\n`);
    process.exit(1); // Exit 1 to block git commit or CI pipeline
  }

  console.log(`Unknown command: ${command}`);
  printHelp();
}

function printHelp() {
  console.log(`
Usage: secretarmor <command> [options]

Commands:
  scan               Scan repository files for leaked API keys, tokens, and credentials
  scan --staged      Scan only git staged changes (Used inside git pre-commit hooks)
  install-hook       Install automated Git pre-commit hook into .git/hooks/pre-commit

Options:
  --help             Show help documentation
  --version          Show CLI version
`);
}

main().catch(err => {
  console.error('SecretArmor Error:', err);
  process.exit(1);
});
