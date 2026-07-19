# TODO — `helpers4/typescript`

> Last refresh: 2026-07-19.

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
- [x] 🔴 Publish v3 — done: v3.0.0 published, followed by v3.0.1 (2026-07-18).

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
- [x] 🟡 **`llms.txt` on helpers4.dev** — done (2026-07-19, `website` repo, `next-feat` branch,
  not yet merged): hand-authored `public/llms.txt` at the site root, H2 per product (typescript,
  devcontainer, action), linking to `/typescript/llms-full.txt` for the TS deep-dive instead of
  duplicating it. That deep-dive file is `build/all/llms.txt` copied by
  `generate-typescript-docs.js` into `public/<DOCS_TARGET>/llms-full.txt` on every doc-gen run
  (one per version slot — `typescript/`, `typescript/next/`, archived `typescript/vN/` all get
  their own snapshot; the major-version archiving step now carries its slot's copy along too).
  Verified end-to-end: ran the generator for real, built the site, confirmed both files serve at
  the right URLs with real content (316KB / 12356 lines for the TS deep-dive).
- [ ] 🟢 Submit to llms.txt discovery directories once the helpers4.dev one exists —
  [llmstxt.site](https://llmstxt.site/submit) (form) and
  [llms-txt-hub](https://github.com/thedaviddias/llms-txt-hub) (PR-based). Low cost, do after
  the site-level file above.
- [ ] 🟢 List helpers4 on general (non-AI) TypeScript discovery sites — the previously-suggested
  target, [dzharii/awesome-typescript](https://github.com/dzharii/awesome-typescript), has been
  **archived (read-only) since 2026-02-11** — verified via `gh repo view`, not a valid PR target
  anymore. Needs a currently-maintained curated TS list found and confirmed active before
  attempting a submission; none of the guessed alternative repo names existed. Aggregator sites
  (libraries.io, npmtrends) still don't need submission, they index npm automatically.
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
> As of 2026-07-13: **7** (not 7.3 — corrected 2026-07-19, the API returns a plain integer, no
> decimal precision available). PRs #108/#109/#110 claim Branch-Protection, Token-Permissions,
> and Signed-Releases fixes, but this same 2026-07-13 scan still shows `Token-Permissions: 0`
> and `Branch-Protection: 3` (not maximal) — only Signed-Releases has been independently
> re-verified as actually fixed (see below). **Unverified**: whether Token-Permissions and
> Branch-Protection are genuinely fixed in the live repo config and just waiting on the same
> "scan predates the fix" rescan lag as Signed-Releases, or whether those two PRs didn't fully
> land — `gh api repos/helpers4/typescript/rulesets` returned `[]` (empty) when checked
> 2026-07-19, but the token used lacks admin rights to confirm that's a real absence of rules
> vs. a permissions gap in the check itself. Needs a maintainer check with an admin token before
> trusting either check's fix as confirmed.

- [x] 🟡 **Signed-Releases → target ≥ 10**: verified (2026-07-19) — `gh release view v3.0.1 --json
  assets` confirms `build-meta.tar.gz.intoto.jsonl` is present on the release, so the provenance
  mechanism works as intended. The live Scorecard score is still showing `Signed-Releases: 0`,
  but that scan is dated 2026-07-13, **before** v3.0.0/v3.0.1 existed — it hasn't rescanned since.
  Nothing left to fix; just re-check `https://api.securityscorecards.dev/projects/github.com/helpers4/typescript`
  after the next scan (Scorecard rescans periodically; no manual trigger available for public repos).
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

---

## 7. Competitive gap analysis (2026-07-19)

> Researched which lodash/ramda-style competitors are still actively maintained, beyond
> radashi/remeda (already in `website`'s comparisons). Found: **es-toolkit** (Toss-backed, very
> active), **rambda** (TS-native Ramda alternative), **moderndash** (smaller, newer). Full
> writeups live in the `website` repo's `comparisons/` pages — this section is the "what's
> actually missing from helpers4" distillation, prioritized. `@mobily/ts-belt` checked and
> excluded (last published 2023-01-10, not active). Effect-TS excluded — different category
> (FP platform/runtime, not a utility library).

- [ ] 🔴 **`Map`/`Set` utilities — a whole missing category.** es-toolkit ships full parallel
  utility sets for native `Map`/`Set` (`forEach`, `filter`, `map`, `reduce`, `some`, `every`,
  `keyBy`, `countBy`, `findKey`/`findValue`). helpers4 currently has **zero** manipulation
  utilities for these — only guards (`isMap`, `isSet`). Highest priority because it's not a
  missing function here and there, it's an entire category gap, and `Map`/`Set` are common
  first-class collections in modern TS code. Needs a design decision: new `@helpers4/map` +
  `@helpers4/set` categories, or fold into an existing one? Probably not — precedent here is one
  category per collection-ish concern (`array`, `object`), so two new categories is likely the
  right shape, not a bolt-on.
- [ ] 🟡 **Concurrency primitives in `@helpers4/promise`.** Converges across *two* competitors
  independently — es-toolkit has `Mutex`, `Semaphore`, `delay`, `timeout`/`withTimeout`;
  moderndash has `sleep`, `timeout`, `retry`, `Queue`. helpers4's `@helpers4/promise` has
  `settle`/`parallel`/`parallelSettle`/typed guards but no lock/semaphore primitives, no generic
  `delay`, no `withTimeout` wrapper. `delay` and `withTimeout` are the cheapest, most clearly
  in-scope additions; `Mutex`/`Semaphore` are a bigger design surface (stateful, class-shaped —
  first non-trivial departure from this repo's all-functions convention, worth a deliberate
  decision rather than copying es-toolkit's shape by default).
- [ ] 🟡 **Number statistics: `median`, `percentile`, `*By` iteratee variants.** helpers4's
  `@helpers4/array` has `mean`/`sum` but no `median`, no `percentile`, and no iteratee variants
  (`meanBy`/`sumBy`) — both es-toolkit and moderndash have `median`. Cheap, well-scoped, no
  design ambiguity — good candidate for a first-timer/contributor issue (see §3).
- [ ] 🟢 **Bulk object-key case transforms: `toCamelCaseKeys`/`toSnakeCaseKeys`.** es-toolkit
  recursively transforms every key of an object to a case style in one call; helpers4 has
  `camelCase`/`snakeCase` for individual strings but nothing that walks an object's keys in bulk.
  Lower priority than the above — real gap, but narrower use case.
- [ ] 🟢 **Async-aware array iteration** (`mapAsync`/`filterAsync`/`forEachAsync` with optional
  concurrency limiting, à la es-toolkit's `limitAsync`). Not a clear add: helpers4 already has
  `parallel`/`parallelSettle` as standalone promise helpers covering similar ground — this would
  need a real design pass to decide whether `Array.prototype`-shaped async methods add enough
  over composing the existing promise helpers to be worth a second API surface for the same
  problem. Flagging as "needs discussion," not "needs implementation."
- [ ] 🟢 **Environment/JSON guards**: `isBrowser`/`isNode` (environment detection), `isJSON`/
  `isJSONArray`/`isJSONObject`/`isJSONValue` (JSON-shape validation), `isLength` (valid
  array-like length) — all present in es-toolkit, absent from `@helpers4/guard`. Lowest priority
  of this list: genuinely useful but narrow, no urgency signal from more than one competitor
  (unlike the concurrency-primitives finding above).
