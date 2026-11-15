import assert from 'node:assert';

import { scanContent } from '../core/src/rules/patterns.js';
import { SecretArmorLicenseVerifier } from '../ee/license/verifier.js';

console.log('🧪 Starting SecretArmor Automated Test Suite...\n');

// 1. Detection Test (Construct strings dynamically so GitHub Push Protection allows test fixtures)
console.log('Test 1: High-Precision Secret Pattern Detection');
const dummyOpenAI = ['sk', 'abcdef1234567890abcdef1234567890abcdef12'].join('-');
const dummyAWS = ['AKIA', 'IOSFODNN7EXAMPLE'].join('');
const dummyStripe = ['sk', 'live', '51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890'].join('_');

const leakSample = [
  `const apiKey = "${dummyOpenAI}";`,
  `const awsKey = "${dummyAWS}";`,
  `const stripeLive = "${dummyStripe}";`,
  `const harmlessCode = "console.log('Normal application code');";`
].join('\n');

const findings = scanContent(leakSample, 'sample.js');

assert.strictEqual(findings.length, 3, 'Must detect exactly 3 secrets');
assert.strictEqual(findings[0].ruleId, 'SEC-OPENAI');
assert.strictEqual(findings[1].ruleId, 'SEC-AWS-KEY');
assert.strictEqual(findings[2].ruleId, 'SEC-STRIPE-LIVE');
assert.ok(findings[0].masked.includes('...'), 'Must safely mask secret in output');

console.log('  ✅ Detected OpenAI key:', findings[0].masked);
console.log('  ✅ Detected AWS Access key:', findings[1].masked);
console.log('  ✅ Detected Stripe Live key:', findings[2].masked);

// 2. Clean Code Test
console.log('\nTest 2: False Positive Resistance on Clean Code');
const cleanSample = `
const port = process.env.PORT || 8080;
function calculateTotal(items) { return items.length * 10; }
export default calculateTotal;
`;
const cleanFindings = scanContent(cleanSample, 'clean.js');
assert.strictEqual(cleanFindings.length, 0, 'Clean code must have 0 findings');
console.log('  ✅ Clean code passed with 0 false positives');

// 3. Enterprise License Verifier Test
console.log('\nTest 3: Offline BSL 1.1 License Verifier');
const verifier = new SecretArmorLicenseVerifier('test-secretarmor-secret');
const key = verifier.generateKey('EnterpriseBank', 180, 'ENT');
const verified = verifier.verifyKey(key);
assert.strictEqual(verified.valid, true);
assert.strictEqual(verified.tier, 'ENTERPRISE');
assert.strictEqual(verified.organization, 'ENTERPRISEBANK');
console.log('  ✅ Offline Enterprise License verified:', key);

console.log('\n🎉 ALL SECRETARMOR TESTS PASSED SUCCESSFULLY!\n');
process.exit(0);
