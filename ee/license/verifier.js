import crypto from 'node:crypto';

/**
 * SecretArmor Enterprise License Key Verifier (BSL 1.1)
 */

const DEFAULT_SECRET = process.env.SECRETARMOR_MASTER_SECRET || '1nsharma-labs-secretarmor-enterprise-seed-2026';

export class SecretArmorLicenseVerifier {
  constructor(secret = DEFAULT_SECRET) {
    this.secret = secret;
  }

  generateKey(organization = 'customer', daysValid = 365, tier = 'ENT') {
    const cleanOrg = organization.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const expiryTimestamp = Math.floor(Date.now() / 1000) + (daysValid * 86400);
    const payload = `${tier}:${cleanOrg}:${expiryTimestamp}`;
    
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();

    return `SA-${tier}-${cleanOrg}-${expiryTimestamp}-${signature}`;
  }

  verifyKey(licenseKey) {
    if (!licenseKey || typeof licenseKey !== 'string') {
      return { valid: false, tier: 'COMMUNITY', reason: 'Running Community CLI.' };
    }

    const parts = licenseKey.trim().split('-');
    if (parts.length < 5 || parts[0] !== 'SA') {
      return { valid: false, tier: 'COMMUNITY', reason: 'Invalid license key format.' };
    }

    const [prefix, tier, organization, expiryStr, signature] = parts;
    const expiryTimestamp = parseInt(expiryStr, 10);

    if (isNaN(expiryTimestamp) || Math.floor(Date.now() / 1000) > expiryTimestamp) {
      return { valid: false, tier: 'COMMUNITY', reason: 'License key expired.' };
    }

    const payload = `${tier}:${organization}:${expiryTimestamp}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();

    if (signature !== expectedSignature) {
      return { valid: false, tier: 'COMMUNITY', reason: 'Cryptographic signature mismatch.' };
    }

    return {
      valid: true,
      tier: tier === 'ENT' ? 'ENTERPRISE' : 'TEAM',
      organization,
      expiresAt: new Date(expiryTimestamp * 1000).toISOString().split('T')[0]
    };
  }
}

export const globalLicenseVerifier = new SecretArmorLicenseVerifier();
