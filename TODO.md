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
- [x] 🟡 `v3.0.0-alpha.1`/`v3.0.0-alpha.2` git tags were **not ancestors** of `v3` (orphaned by
  the rebase onto `main`). **Resolved (2026-07-15)**: `v3` merged into `main` directly (no PR —
  confirmed via `gh pr list`). Both tags re-pointed from their orphaned commits to the matching
  `chore(release): bump version to 3.0.0-alpha.N` commits now on `main` (verified identical
  `package.json` version field before moving), re-signed, force-pushed. Both now correctly
  resolve as ancestors of `main`.
  **New finding while doing this**: the merge only carried `v3` up through the "resolve
  orphaned-tags" commit — the entire two-round bug-fix code review session that followed
  (24 commits, 7 real bugs: prototype pollution in `omitBy`/`flatten`, `DeepSet` empty-path type,
  `parseDuration` misparsing `"500ms"`, `toggle()` NaN handling, `EpochMilliseconds` restoration,
  `cloneDeep` silently losing Map/Set data, color-clamp fixes, plus the `@since` coherency check)
  was never pushed and is **not on `main`**. Recovered into a local branch
  (`v3-fixes-recovery`, not yet pushed) so nothing is lost — integrating it is a separate,
  not-yet-decided follow-up.
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
  orientation, not a replacement. Confirmed compliant with the llmstxt.org spec (only a H1 is
  actually required; our blockquote + H2 link-list sections already follow the
  `[name](url): notes` format).
- [ ] 🟡 **`llms.txt` on helpers4.dev** (the actual public site, not just the repo) — this is
  where the llms.txt discovery directories (llmstxt.site, llms-txt-hub, directory.llmstxt.cloud)
  actually crawl; a repo-root file doesn't get picked up there. **Not a copy of
  `@helpers4/all`'s llms.txt** (307KB, TS-only) — helpers4.dev documents 3 products
  (typescript, devcontainer, action, per `website/AGENTS.md`), so the site-level file needs its
  own root file with H2 sections per product, *linking to* the already-generated
  `@helpers4/all` llms.txt for the TS deep-dive rather than duplicating it (publish
  `build/all/llms.txt` somewhere under the site, e.g. `/typescript/llms-full.txt`). This lives
  in the `website` repo, not this one.
- [ ] 🟢 Submit to llms.txt discovery directories once the helpers4.dev one exists —
  [llmstxt.site](https://llmstxt.site/submit) (form) and
  [llms-txt-hub](https://github.com/thedaviddias/llms-txt-hub) (PR-based). Low cost, do after
  the site-level file above.
- [ ] 🟢 List helpers4 on general (non-AI) TypeScript discovery sites — the cheapest, most
  established option is a PR to a curated "awesome" list, e.g.
  [awesome-typescript](https://github.com/dzharii/awesome-typescript). Aggregator sites
  (libraries.io, npmtrends) don't need submission, they index npm automatically.
- [ ] 🟢 Package `/add-helper` (or the not-yet-built consumer-facing skill) as a real Claude
  Code **plugin** (`.claude-plugin/marketplace.json`) and submit to
  [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) —
  only makes sense for the consumer-facing skill (see item below); `/add-helper` is
  project-scoped by nature and gains nothing from external listing since it only helps people
  already working in this repo.
- [x] 🟡 Audit AI-agent config consistency across the workspace (2026-07-14) — found and fixed:
  `.dev/AGENTS.md`'s "never git commit" rule read as absolute despite explicit per-turn
  authorization being a normal thing to grant — clarified it's per-turn, not standing.
  `typescript/AGENTS.md` had a factually wrong claim ("cross-package imports break
  tree-shaking") contradicted by 20+ existing cross-category imports — fixed, and documented
  the real `BREAKING CHANGE:` footer requirement for `git-cliff`. Auto-memory store was
  completely empty despite months of session history — seeded with the findings above.
- [x] 🟡 Contributor-facing Claude Code skill — added `/add-helper` (2026-07-14,
  `.claude/skills/add-helper/SKILL.md`): scaffolds a new helper's 4 files following
  `CONTRIBUTING.md`, bakes in conventions that only live in `AGENTS.md`/session history
  (naming: no lodash/math jargon, cross-category imports are safe, verification command order,
  per-turn commit authorization).
- [ ] 🟢 **Consumer-facing Claude Code skill** (not built — needs a separate design pass):
  unlike `/add-helper` (helps people contribute *to* this repo), this would help people *using*
  `@helpers4/*` as a dependency in their own project avoid reinventing a utility that already
  exists here. Sketch:
  - Trigger: before writing a new small utility function (array/object/string/date manipulation,
    a type guard, etc.), check whether `@helpers4/<category>` already has it.
  - Source of truth: the per-package `llms.txt` already generated at build time (see item above)
    — no new data pipeline needed, just point the skill at it (fetched from npm/unpkg, or from
    `node_modules/@helpers4/<category>/llms.txt` if the package is already installed).
  - Distribution is the hard part, same issue as the "good first issue" outreach blocker: a
    skill nobody installs has zero effect. Needs to ship through something with actual reach —
    a Claude Code plugin/marketplace listing, or bundled as an optional install step in
    `CONTRIBUTING.md`/README for people already using the lib — not just dropped in this repo's
    `.claude/skills/` (which only helps people already working *in* this repo, i.e. the
    `/add-helper` use case, not the "instead of writing my own debounce, use helpers4" use
    case).
  - Worth prototyping once there's an actual channel to distribute it through — building it
    before that exists is the same mistake as opening good-first-issues before there was
    traffic to see them.

---

## 3. 🫂 Wanted: contributors

> Blocked while the project is solo. One regular collaborator unlocks the `Code-Review`
> Scorecard check (~+2 pts) and makes human review possible.

- [x] 🔴 Open "good first issue" labelled issues to attract first-timers — **reconsidered twice
  (2026-07-14)**: first drafted the missing-`.bench.ts` gap as an issue candidate, then realized
  opening it was premature (nobody watches this repo's issue tracker yet, so the label attracts
  no one without outreach happening first — sequence matters: outreach → traffic → issues). Since
  there was nothing stopping *me* from just doing the mechanical work directly instead of waiting
  for a first-timer, wrote the 98 missing benchmark files myself (97 candidates + `markdown/escape`
  caught on a final audit pass) rather than leave it queued. Deliberately skipped `ci/*` (3),
  `promise/*` (11), `observable/combine`+`combineLatest`+`isObservable` (3), and `version/stripV`
  (1) — thin wrappers / trivial one-liners, per CONTRIBUTING.md's own "type guards and thin
  wrappers do not need benchmarks" policy. All new files pass `typecheck`/`lint`, and every
  category's full bench suite was run once to confirm no runtime errors.
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
- [ ] 🟢 Publish packages to JSR in addition to npm — investigated across **all 18 categories**
  (2026-07-14, real `npx jsr publish --dry-run` per category, alpha branch, no pipeline changes
  committed). Bigger than originally scoped — a real architectural question, not just tooling:
  1. `jsr.json`'s `exports` must point at **TypeScript source** (e.g. `helpers/<category>/index.ts`),
     not `build/<category>/`.
  2. `helpers/<category>/index.ts` is gitignored (generated by `pnpm build`) — needs
     `publish.exclude: ["!helpers/<category>/index.ts"]` to un-exclude it from JSR's
     gitignore-mirroring default (`error[excluded-module]` otherwise).
  3. Needs an explicit `publish.include` scoped to `helpers/<category>/**/*.ts` (minus
     test/spec/example/bench files) — otherwise JSR bundles the entire monorepo.
  4. **The real finding**: 7 of 18 categories have **cross-category imports** reaching outside
     their own folder — safe and inlined for the npm build (Rollup), but JSR publishes raw
     source per-package with no bundler, so each cross-category import is a *second*
     `error[excluded-module]` (the imported file lives outside that category's `publish.include`
     scope). Exact per-category breakdown:
     - `array` → `guard/isArray`, `guard/isFalsy`, `guard/isPlainObject`, `number/clamp`,
       `object/equalsShallow`, `_shared/_unsafeKeys` (6 files)
     - `object` → `array/equalsDeep`, `date/compare`, `date/ensureDate`, `date/timestamp`,
       `date/types`, `guard/isNullish`, `guard/isPlainObject`, `guard/isSpecialObject`,
       `type/DeepGet`, `type/DeepSet`, `type/UnionToIntersection`, `_shared/_unsafeKeys`
       (11 files — the worst case)
     - `color` → `number/clamp`, `number/roundTo`, `_shared/_hexColorGrammar` (3 files)
     - `guard` → `type/Maybe`, `_shared/_hexColorGrammar` (2 files)
     - `observable` → `guard/isDefined`, `type/Maybe` (2 files)
     - `function` → `guard/isNullish` (1 file)
     - `string` → `guard/isPlainObject` (1 file)
     - Clean with zero cross-category imports (pass as-is): `ci`, `commit`, `date`, `id`,
       `markdown`, `node`, `number`, `promise`, `type`, `url`, `version`.
     `id`/`uuid7.ts`'s slow-types check (the thing I originally worried about) passed cleanly —
     turned out to be the easy part. The real blocker is structural.
  **Needs a design decision, not implementation, next**: either (a) physically include each
  category's transitive cross-category `.ts` files in its own JSR publish set (works, but each
  JSR package stops being a clean single-owner unit — e.g. `@helpers4/array` would ship its own
  copy of `guard/isFalsy.ts`), or (b) declare real JSR-to-JSR package dependencies
  (`@helpers4/guard` as an actual `jsr:` import) plus a publish-time import-rewrite step
  (relative `'../guard/isFalsy'` → bare `'@helpers4/guard'` specifier) — more correct, but needs
  new build tooling and 17 packages need to publish in dependency order.
  Remaining work either way: a `jsr.json` generator in the build pipeline, a `jsr publish` step
  in `scripts/version/release.ts`, and (path b only) an import-rewrite step. Still 🟢 — not
  urgent, but no longer a small task.

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
