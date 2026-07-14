# TODO — `helpers4/typescript`

> Last refresh: 2026-07-14.

Legend: 🔴 High priority · 🟡 Medium · 🟢 Low

---

## 1. v3 release readiness

> Publishing a major version is a public, irreversible action — always confirm explicitly
> before triggering it, and only once the checklist below is clean.

- [x] 🔴 Audit `@deprecated` tags before cutting v3 — checked (2026-07-14): zero matches across
  `helpers/`, `scripts/`, and everything else except this TODO. Nothing to remove.
- [x] 🔴 Confirm CHANGELOG / migration notes cover all breaking changes since v2 — they didn't
  (2026-07-14): the 6 breaking refactor commits (`type`→`guard` split + 5 removed deprecated
  aliases) used prose like "Breaking change for v3." instead of the Conventional Commits
  `BREAKING CHANGE:` footer, so git-cliff silently never flagged them. Fixed: added
  [MIGRATION.md](MIGRATION.md) with a proper `BREAKING CHANGE:` footer commit, linked it from
  `cliff.toml`'s header, and regenerated `CHANGELOG.md` (which was also stale since
  2.0.0-alpha.11 — every release through 2.1.0 plus all of v3 was missing from it).
- [ ] 🟡 **New finding**: `v3.0.0-alpha.1`/`v3.0.0-alpha.2` git tags are **not ancestors** of the
  current `v3` branch HEAD (orphaned, likely by the earlier `v3` rebase onto `main`). Any
  release tooling that diffs against "the last tag" may misbehave. Needs a decision before
  release: re-tag, delete + let the next real tag be `v3.0.0-alpha.3`/`v3.0.0`, or confirm the
  release script doesn't actually rely on tag ancestry. **Not resolved — needs baxyz input**,
  tag manipulation is not something to do unilaterally.
- [ ] 🔴 Publish v3 — only after every item above is resolved and explicitly confirmed by baxyz.

---

## 2. Making the library AI-friendly

> Goal: an LLM/agent exploring or consuming this repo should get correct info fast, without
> parsing the whole codebase. "Promoting" the lib to AI communities isn't a task an agent can
> execute on the maintainer's behalf — a good `llms.txt` + structured docs *is* the promotion,
> agents that crawl the repo or the docs site will pick it up naturally.

- [x] 🔴 Add an `llms.txt` at the repo root — package list, conventions, doc links
  (2026-07-14). Turns out each package **already** ships its own much richer auto-generated
  `llms.txt` (full signatures/params/examples from `meta/api.json`, see
  `scripts/build/build-llms-txt.ts`) — the root one is complementary, for repo-level
  orientation, not a replacement. `llms-full.txt` / helpers4.dev version not done — low value
  until the site itself needs it.
- [x] 🟡 Audit AI-agent config consistency across the workspace (2026-07-14) — found and fixed:
  `.dev/AGENTS.md`'s "never git commit" rule read as absolute despite explicit per-turn
  authorization being a normal thing to grant — clarified it's per-turn, not standing.
  `typescript/AGENTS.md` had a factually wrong claim ("cross-package imports break
  tree-shaking") contradicted by 20+ existing cross-category imports — fixed, and documented
  the real `BREAKING CHANGE:` footer requirement for `git-cliff`. Auto-memory store was
  completely empty despite months of session history — seeded with the findings above.

---

## 3. 🫂 Wanted: contributors

> Blocked while the project is solo. One regular collaborator unlocks the `Code-Review`
> Scorecard check (~+2 pts) and makes human review possible.

- [ ] 🔴 Open "good first issue" labelled issues to attract first-timers — **reconsidered
  (2026-07-14)**: drafted a candidate (missing `.bench.ts` files, 202/241 helpers), but opening
  it now is premature — nobody currently watches this repo's issue tracker, so a "good first
  issue" label attracts no one without the outreach/visibility item below happening first.
  Sequence matters: outreach → traffic → then issues are worth opening.
- [ ] 🔴 Mention the project in TS communities (TypeScript Discord, Reddit r/typescript,
  X/Twitter) — outreach, not something an agent can do on the maintainer's behalf.
- [x] 🔴 Write a clear `CONTRIBUTING.md` with devcontainer setup in 2 commands — added, pointing
  at the sibling `helpers4/.dev` orchestration repo's devcontainer (2026-07-14).
- [x] 🔴 Add a "PRs welcome" badge to the README (2026-07-14).
- [ ] 🟡 Once a regular reviewer joins: raise `required_approving_review_count` to `1` in the
  `main` ruleset, merge a few PRs with human approvals, record evidence per PR (URL, reviewer,
  timestamp) — unlocks `Code-Review` scoring.

---

## 4. OpenSSF Scorecard

> Live score: check `curl -s https://api.securityscorecards.dev/projects/github.com/helpers4/typescript`.
> As of 2026-07-13: **7.3**, trending up after PRs #108/#109/#110 (Branch-Protection,
> Token-Permissions, Signed-Releases fixes — see git history for the investigation).

- [ ] 🟡 **Signed-Releases → target ≥ 10**: provenance mechanism (`attest-build-provenance` +
  `.intoto.jsonl` release asset) landed on `main` via PR #110, but only observable at the
  **next real release** — a Scorecard rescan alone won't show it. After the next release:
  `gh release view vX.Y.Z --json assets` should list `*.intoto.jsonl`, then re-check the score.
- [ ] 🟢 **CII-Best-Practices Silver/Gold** — deferred, requires sustained contributor activity
  (currently solo project).

---

## 5. Code quality & tooling

- [x] 🟢 Improve mutation score — checked (2026-07-14): **92.5%**, already high. Downgraded to
  low priority — chasing the remaining ~7.5% is diminishing returns until the
  [Stryker dashboard](https://dashboard.stryker-mutator.io/reports/github.com/helpers4/typescript/main)
  is checked for a specific weak file worth targeting.
- [x] 🟡 Verify browser compatibility — checked (2026-07-14): no Node-only APIs leak outside
  `helpers/node/` (the 2 grep hits on `Buffer`/`process` were a JSDoc word and a string-literal
  constructor-name check — both browser-safe). **But found a real gap**: `package.json`'s
  `runtimes.browser: "ES2022+"` claim doesn't hold for the `Temporal`-based date helpers
  (`ensureDate`, `range`, `timeAgo`, `formatDuration`, `timezone` + 6 `guard/isTemporal*`
  guards) — `Temporal` is not part of the ES2022 spec, ships zero-dependency (no polyfill), and
  as of 2026-07-14 has ~64% global coverage: Chrome 144+ and Firefox 139+ support it natively,
  but **Safari has no stable support** (behind a flag in Technical Preview only; WebKit signals
  full support "late 2026"). CI only tests Node/Deno/Bun, never an actual browser. **Needs a
  maintainer decision, not a silent fix**: document the Safari caveat next to the `browser`
  badge/claim, scope it down (e.g. `"browser: Chrome 144+, Firefox 139+"`), or accept a
  polyfill as an optional peer dependency for the `date`/`guard` packages specifically.
  ([caniuse](https://caniuse.com/temporal), [web-features](https://web-platform-dx.github.io/web-features-explorer/features/temporal/))
- [ ] 🟢 Publish packages to JSR in addition to npm — investigated (2026-07-14), bigger than
  "add a jsr.json" but a concrete recipe now exists, tested with a real `npx jsr publish
  --dry-run` against the `id` package:
  1. `jsr.json`'s `exports` must point at **TypeScript source** (e.g. `helpers/<category>/index.ts`),
     not `build/<category>/`.
  2. `helpers/<category>/index.ts` is gitignored (generated by `pnpm build`) — JSR's default
     file-inclusion mirrors `.gitignore`, so it silently **excludes the entry point** unless
     `publish.exclude` adds a negative glob to un-exclude it (`"!helpers/<category>/index.ts"`).
     Confirmed via the exact error: `error[excluded-module]`.
  3. Without an explicit `publish.include` scoped to that category's files, JSR bundles the
     **entire monorepo** (workflows, other categories, scripts/) into the "package" — needs
     `include: ["helpers/<category>/**/*.ts", "!**/*.test.ts", "!**/*.spec.ts", ...]` per package.
  4. `id`/`uuid7.ts` passed the slow-types check cleanly on the first try (explicit return type
     already in place) — not yet tested against a category with more complex overloads
     (`pick`/`pickBy`-style 3-overload functions are the likely risk).
  Remaining work: a `jsr.json` generator step in the build pipeline (mirrors how
  `build/<category>/package.json` is already generated), a `jsr publish` step added to
  `scripts/version/release.ts` / the release workflow (OIDC, no token needed), and a slow-types
  pass across the other 17 categories. Sizeable enough to be its own task, not a quick add-on.

---

## 6. Future / needs design discussion

- [ ] 🟢 New "settings" package for shared tool configs (vite, vitest, oxc, lint, cspell, …),
  customized for helpers4/baxyz instead of depending on a third-party preset (airbnb, angular…).
  **Not a `helpers/` category** — configs don't compile/tree-shake like functions, so this
  should be a separate package or sibling repo, not a folder under `helpers/`. Needs a design
  decision before implementation.
- [ ] 🟢 Full migration to TS 7.x (`tsgo`) for build + emit, not just `typecheck` — currently
  `tsgo --noEmit` is used for fast type-checking only; the actual build/`.d.ts` emit still goes
  through classic `typescript@^6`. `tsgo` (`@typescript/native-preview`) is still a preview/dev
  build without full emit parity — revisit at each new tsgo release rather than migrating now,
  since `.d.ts` output is a published deliverable, not an internal detail.
