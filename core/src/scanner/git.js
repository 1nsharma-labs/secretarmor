import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { scanContent } from '../rules/patterns.js';

/**
 * SecretArmor Git Scanner & Hook Installer
 */
export class GitScanner {
  constructor(rootPath = process.cwd()) {
    this.rootPath = rootPath;
  }

  /**
   * Scan staged git diff
   */
  scanStaged() {
    try {
      const diffOutput = execSync('git diff --staged --name-only', { encoding: 'utf-8', cwd: this.rootPath });
      const stagedFiles = diffOutput.trim().split('\n').filter(Boolean);

      const allFindings = [];
      for (const file of stagedFiles) {
        const fullPath = path.resolve(this.rootPath, file);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const fileFindings = scanContent(content, file);
          allFindings.push(...fileFindings);
        }
      }

      return { scannedCount: stagedFiles.length, findings: allFindings, isStaged: true };
    } catch {
      // Fallback: Scan directory
      return this.scanDirectory(this.rootPath);
    }
  }

  /**
   * Scan entire directory recursively
   */
  scanDirectory(dirPath = this.rootPath) {
    const findings = [];
    let fileCount = 0;

    const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'coverage', '.idea', '.vscode', 'test']);

    function walk(current) {
      if (!fs.existsSync(current)) return;
      const entries = fs.readdirSync(current, { withFileTypes: true });

      for (const entry of entries) {
        if (ignoredDirs.has(entry.name)) continue;
        const fullPath = path.join(current, entry.name);

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile()) {
          fileCount++;
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const fileFindings = scanContent(content, path.relative(dirPath, fullPath));
            findings.push(...fileFindings);
          } catch {
            // Binary or unreadable file
          }
        }
      }
    }

    walk(dirPath);
    return { scannedCount: fileCount, findings, isStaged: false };
  }

  /**
   * Install automated Git pre-commit hook
   */
  installHook() {
    const gitHooksDir = path.join(this.rootPath, '.git', 'hooks');
    if (!fs.existsSync(gitHooksDir)) {
      throw new Error('Not a git repository: .git/hooks directory not found.');
    }

    const preCommitPath = path.join(gitHooksDir, 'pre-commit');
    const hookScript = `#!/usr/bin/env sh
# SecretArmor Automated Pre-Commit Hook (1nsharma-labs)
echo "🛡️ SecretArmor: Verifying staged files for leaked credentials..."
npx secretarmor scan --staged
if [ $? -ne 0 ]; then
  echo "❌ Commit rejected by SecretArmor! Leaked secrets detected in staged files."
  exit 1
fi
`;

    fs.writeFileSync(preCommitPath, hookScript, { mode: 0o755 });
    return preCommitPath;
  }
}
