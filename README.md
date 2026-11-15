<p align="center">
  <img src="https://raw.githubusercontent.com/1nsharma-labs/secretarmor/main/ui/logo.png" alt="SecretArmor Logo" width="100" onerror="this.style.display='none'"/>
</p>

<h1 align="center">🛡️ SecretArmor</h1>

<p align="center">
  <b>The Open-Source Zero-Trust Secret Sprawl & API Key Leak Prevention Firewall</b><br>
  Catch exposed OpenAI keys, AWS secrets, Stripe live tokens, and database passwords before they reach GitHub. 1-second pre-commit hooks and CI/CD secret scanning.
</p>

<p align="center">
  <a href="https://github.com/1nsharma-labs/secretarmor/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="License"></a>
  <a href="https://github.com/1nsharma-labs/secretarmor/blob/main/ee/LICENSE-EE"><img src="https://img.shields.io/badge/EE_License-BSL_1.1-purple.svg" alt="EE License"></a>
  <a href="https://github.com/sponsors/1nsharma"><img src="https://img.shields.io/badge/Sponsor-GitHub_Sponsors-pink.svg" alt="Sponsor"></a>
</p>

---

## ⚡ What is SecretArmor?

Accidentally committing an **OpenAI API Key**, **AWS Secret Key**, or **Stripe Live Token** can cost a company tens of thousands of dollars within minutes.

Commercial tools like GitGuardian charge **\$15,000 to \$30,000 per year** for enterprise secret scanning.

**SecretArmor** is an ultra-fast, open-source pre-commit hook and repository scanner that detects 20+ secret types and blocks dangerous commits directly on developer laptops:
1. **Pre-Commit Shield:** Installs in 1 second into `.git/hooks/pre-commit` and audits `git diff --staged`.
2. **Deep Pattern Matcher:** Detects OpenAI (`sk-...`), Anthropic (`sk-ant-...`), AWS (`AKIA...`), Stripe (`sk_live_...`), GitHub PATs, and private SSH keys.
3. **CI/CD Quality Gate:** Runs inside GitHub Actions with zero external network dependencies.

---

## 🚀 Quick Start (30 Seconds)

### 1. Install Git Pre-Commit Hook

```bash
# Automatically protect current git repo
npx secretarmor install-hook
```

Now, every time an engineer runs `git commit`, SecretArmor scans staged diffs in `< 100ms` and blocks any leaked secrets!

### 2. Scan Existing Repository

```bash
npx secretarmor scan
```

---

## 💻 CLI Commands

```bash
secretarmor scan           # Audit all files in the current repository
secretarmor scan --staged  # Audit only git staged changes (Pre-commit mode)
secretarmor install-hook   # Install automated git pre-commit hook
```

---

## 💼 Dual Licensing & Open-Core Model

* **Community CLI (`/core`):** 100% Free under **Apache License 2.0**.
* **Enterprise Edition (`/ee`):** Licensed under **Business Source License (BSL 1.1)** for centralized SIEM logging, Slack instant security alerts, and automated secret revocation hooks.

See [PRICING.md](PRICING.md) for full details.

---

## 🌐 The 1nsharma-labs Open-Source Suite

Explore our interconnected developer tools to slash costs and automate governance:
* 🛡️ [**TokenArmor**](https://github.com/1nsharma-labs/tokenarmor): AI Gateway & Token FinOps Firewall.
* 🍃 [**CloudPrune**](https://github.com/1nsharma-labs/cloudprune): AWS & GCP Cloud Waste & Zombie Resource Killer.
* 🔒 [**CompliGuard**](https://github.com/1nsharma-labs/compliguard): Continuous SOC 2 & ISO 27001 Evidence Engine.
* 🛡️ [**SecretArmor**](https://github.com/1nsharma-labs/secretarmor): Zero-Trust Secret Sprawl & API Key Leak Firewall.

---

## 🤝 Sponsoring & Community

* **GitHub Sponsors:** [github.com/sponsors/1nsharma](https://github.com/sponsors/1nsharma)
* **Maintained by:** [1nsharma-labs](https://github.com/1nsharma-labs)
