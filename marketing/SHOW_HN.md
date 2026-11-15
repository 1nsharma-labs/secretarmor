# Show HN: SecretArmor – Open-source secret leak and API key firewall

Title: Show HN: SecretArmor – Open-source secret leak and API key firewall for pre-commit

Repo: https://github.com/1nsharma-labs/secretarmor

Hey HN,

Accidentally pushing an OpenAI API key or AWS secret to GitHub happens all too often.

Commercial tools like GitGuardian charge $15,000–$30,000/year for secret scanning.

We built **SecretArmor** (https://github.com/1nsharma-labs/secretarmor): an ultra-fast, zero-dependency git pre-commit hook and repository scanner.

Features:
- Catches 20+ secret patterns (OpenAI, Anthropic, AWS, Stripe live keys, private SSH keys, database URIs with passwords)
- 1-second install into .git/hooks/pre-commit
- Scans staged changes in < 100ms before git commit
- 100% self-hosted with zero telemetry

Core is Apache 2.0.

Install in your repo in 1 command:
$ npx secretarmor install-hook

Feedback and contributions welcome!
