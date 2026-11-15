/**
 * SecretArmor High-Precision Secret Detection Rules
 */

export const SECRET_RULES = [
  {
    id: 'SEC-OPENAI',
    name: 'OpenAI API Secret Key',
    severity: 'CRITICAL',
    regex: /\b(sk-[a-zA-Z0-9_\-]{32,})\b/g
  },
  {
    id: 'SEC-ANTHROPIC',
    name: 'Anthropic Claude API Key',
    severity: 'CRITICAL',
    regex: /\b(sk-ant-[a-zA-Z0-9_\-]{32,})\b/g
  },
  {
    id: 'SEC-GOOGLE-AI',
    name: 'Google Gemini API Key',
    severity: 'CRITICAL',
    regex: /\b(AIzaSy[a-zA-Z0-9_\-]{33})\b/g
  },
  {
    id: 'SEC-AWS-KEY',
    name: 'AWS Access Key ID',
    severity: 'CRITICAL',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g
  },
  {
    id: 'SEC-STRIPE-LIVE',
    name: 'Stripe Live Secret Key',
    severity: 'CRITICAL',
    regex: /\b((?:sk|rk)_live_[0-9a-zA-Z]{24,})\b/g
  },
  {
    id: 'SEC-GITHUB-TOKEN',
    name: 'GitHub Personal Access Token',
    severity: 'HIGH',
    regex: /\b((?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})\b/g
  },
  {
    id: 'SEC-SLACK-BOT',
    name: 'Slack Bot Token',
    severity: 'HIGH',
    regex: /\b(xoxb-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24})\b/g
  },
  {
    id: 'SEC-PRIVATE-KEY',
    name: 'Private Cryptographic Key',
    severity: 'CRITICAL',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g
  },
  {
    id: 'SEC-DATABASE-URL',
    name: 'Database URI with Password',
    severity: 'HIGH',
    regex: /(?:postgres|mysql|mongodb(?:\+srv)?):\/\/[a-zA-Z0-9_\-]+:[^@\s]+@[a-zA-Z0-9_\-\.]+/g
  }
];

export function scanContent(content = '', filename = 'stdin') {
  const findings = [];
  const lines = content.split('\n');

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    for (const rule of SECRET_RULES) {
      // Reset regex state
      rule.regex.lastIndex = 0;
      let match;

      while ((match = rule.regex.exec(line)) !== null) {
        const rawMatch = match[0];
        // Mask secret for safe logging
        const masked = rawMatch.length > 8 
          ? rawMatch.slice(0, 4) + '...' + rawMatch.slice(-4)
          : '***REDACTED***';

        findings.push({
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          filename,
          line: lineIndex + 1,
          masked,
          characterStart: match.index
        });
      }
    }
  }

  return findings;
}
