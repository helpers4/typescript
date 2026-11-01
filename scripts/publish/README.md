# Publishing scripts

Releases are made by `.github/workflows/release.yml` with helpers4/action-release (see
[../RELEASE.md](../RELEASE.md)). What remains here is the recovery tool.

## `unpublish-version.ts`

```bash
pnpm exec tsx scripts/publish/unpublish-version.ts 3.0.8
pnpm exec tsx scripts/publish/unpublish-version.ts --version 3.0.8 --dry-run
pnpm exec tsx scripts/publish/unpublish-version.ts 3.0.8 --otp 123456
```

npm has no safe undo for a publish: `npm unpublish` permanently bans republishing that exact
version. Prefer fixing forward with the next version.
