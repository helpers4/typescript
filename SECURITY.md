<!--
  This file is part of helpers4.
  Copyright (C) 2025 baxyz
  SPDX-License-Identifier: LGPL-3.0-or-later
-->

# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 2.x (latest stable) | ✅ |
| < 2.0 | ❌ |

Only the latest stable release receives security fixes.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Use GitHub's private vulnerability reporting to send a confidential report directly to the maintainer:

👉 **[Report a vulnerability privately](https://github.com/helpers4/typescript/security/advisories/new)**

This keeps the details private until a fix is released.

### What to include

- A description of the vulnerability and its potential impact
- Steps to reproduce or a minimal proof of concept
- Affected version(s)
- Any suggested mitigation (optional)

## Response timeline

| Step | Target |
| ---- | ------ |
| Initial acknowledgement | ≤ 7 days |
| Status update | ≤ 14 days |
| Fix released (if confirmed) | As soon as practical |

## Scope

`@helpers4` packages are zero-dependency TypeScript utility functions. The attack surface is limited to:

- **In scope**: bugs in helper logic that could cause incorrect behavior when processing untrusted input (e.g., prototype pollution, ReDoS)
- **Out of scope**: vulnerabilities in devDependencies that do not affect the published packages, or issues requiring physical access to the developer's machine

## Disclosure policy

Once a fix is available, the vulnerability will be disclosed via a [GitHub Security Advisory](https://github.com/helpers4/typescript/security/advisories) and noted in the [CHANGELOG](./CHANGELOG.md).
