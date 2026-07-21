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
- [x] 🟡 **`llms.txt` on helpers4.dev** — done (2026-07-19, `website` repo, merged): hand-authored
  `public/llms.txt` at the site root, H2 per product (typescript, devcontainer, action), linking
  to `/typescript/llms-full.txt` for the TS deep-dive instead of duplicating it. That deep-dive
  file is `build/all/llms.txt` copied by `generate-typescript-docs.js` into
  `public/<DOCS_TARGET>/llms-full.txt` on every doc-gen run (one per version slot —
  `typescript/`, `typescript/next/`, archived `typescript/vN/` all get their own snapshot).
  **Found broken and fixed (2026-07-21)**: despite this, the live `llms-full.txt` had been stuck
  at v3.0.1 through 3.0.2/3.0.3/3.0.4 — three independent bugs, all now fixed, all verified
  live in prod (curl'd the real URL, confirmed "Version: 3.0.4 / ~312 functions / 20
  categories"):
  1. `typescript` repo's `release.yml` only packaged `*/meta/*.json` into `build-meta.tar.gz`
     for the website to consume — `llms.txt` lives outside `meta/`, so it was never included;
     the website generator warned and silently skipped regenerating `llms-full.txt` every time.
  2. Same gap in the website's npm-package fallback path (`fetch_from_npm_packages`) — fixed
     for defense-in-depth even though the primary path is what's actually in use.
  3. Even with (1)/(2) fixed, `on-typescript-release.yml`'s commit step only staged
     `src/content/docs/<target>/` and `src/data/versions.json` — never `public/typescript/`,
     where `llms-full.txt` actually lives — so it could be correctly regenerated on disk and
     still silently never get committed ("No changes to commit").
  Retroactively repaired the already-stale v3.0.4 release too: rebuilt from the exact tag,
  confirmed the corrected `build-meta.tar.gz` is a byte-identical superset of the original
  (only `buildDate` differs) before re-uploading it to the live GitHub release — **this
  invalidated that asset's Sigstore provenance attestation** (signed against the old content),
  a real Signed-Releases scorecard tradeoff accepted to fix the live content immediately rather
  than wait for 3.0.5. Also fixed the root `public/llms.txt`'s hand-authored counts (still
  18/274, now 20/312) — stays hand-authored, so it'll drift again after future releases unless
  someone remembers to update it (not automated).
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
- [x] 🟡 **`typecheck` migrated to real TypeScript 7** (2026-07-20) — TS 7.0 shipped stable
  2026-07-08, as `typescript@latest` (7.0.2) itself; `@typescript/native-preview` (the old
  `tsgo`-named preview package we depended on) is now obsolete, frozen on a dev-build predating
  the stable release. Switched via npm aliasing: `"@typescript/native": "npm:typescript@^7.0.2"`
  (fast native compiler, bin `tsc`) plus `"typescript": "npm:@typescript/typescript6@^6.0.2"`
  (classic-API compatibility package, bin `tsc6`, so anything doing `require('typescript')` —
  i.e. `rollup-plugin-dts` — keeps working unchanged). `typecheck` script updated from
  `tsgo --noEmit` to `tsc --noEmit` (bin renamed back to `tsc` in the stable release).
  **Build/`.d.ts` emit still blocked, and it's a different blocker than previously thought**:
  our `.d.ts` bundling goes through `rollup-plugin-dts`, which depends on the classic TS
  Compiler API (`ts.createProgram` etc.) — and TypeScript 7.0's main package export is now
  *only* `version`/`versionMajorMinor` (verified directly: `require('typescript@7.0.2').createProgram`
  is `undefined`), no compiler API at all outside explicitly-`unstable/*` subpaths. Not
  something we can fix from this repo — tracked upstream at
  [Swatinem/rollup-plugin-dts#395](https://github.com/Swatinem/rollup-plugin-dts/issues/395)
  (open; maintainer has a working fix on a branch using the same `@typescript/typescript6`
  alias pattern, not yet merged/released). Revisit once that ships, or once TS 7.1 (already in
  `next` as of today) delivers the promised new stable API.

---

## 7. Competitive gap analysis (2026-07-19)

> Researched which lodash/ramda-style competitors are still actively maintained, beyond
> radashi/remeda (already in `website`'s comparisons). Found: **es-toolkit** (Toss-backed, very
> active), **rambda** (TS-native Ramda alternative), **moderndash** (smaller, newer). Full
> writeups live in the `website` repo's `comparisons/` pages — this section is the "what's
> actually missing from helpers4" distillation, prioritized. `@mobily/ts-belt` checked and
> excluded (last published 2023-01-10, not active). Effect-TS excluded — different category
> (FP platform/runtime, not a utility library).

- [x] 🔴 **`Map`/`Set` utilities** (2026-07-19, revised same day after checking against native
  JS) — added as two separate categories, not a combined `@helpers4/collection`: the repo's own
  precedent (`array`/`object` share `compact`/`equalsShallow` **on purpose**, documented in
  `CONTRIBUTING.md`'s "Intentional cross-category duplicates") already answers "one category
  per type vs. one for the operation-kind" in favor of per-type, and `guard`/`type` (the
  operation-kind categories) don't fit Map/Set's shape.
  `@helpers4/map` (11 functions): `filter`, `reduce`, `some`, `every`, `countBy`, `toMapByKey`,
  `findKey`, `findValue`, `hasValue`, `mapKeys`, `mapValues`.
  `@helpers4/set` (4 functions): `filter`, `countBy`, `toMapByKey`, `map`.
  (`keyBy` renamed to `toMapByKey` after review — lodash's `_.keyBy` returns a plain object,
  not a `Map`, so the bare name risked exactly that wrong assumption; the `to<Type>` prefix
  disambiguates the same way `toSorted`/`toReversed` do.)
  **Checked against native JS on the actual Node 26 baseline before finalizing** (not just
  assumed) — dropped 6 of the originally-planned functions as genuine duplicates:
  `map.forEach`/`set.forEach` (native `Map`/`Set.prototype.forEach` already exist, identical
  signature) and `set.reduce`/`some`/`every`/`find` (native since Node 22's Iterator Helpers —
  `set.values().reduce/some/every/find(fn)` — and unlike `Map`, `Set` already iterates plain
  values with no tuple to destructure, so there was no real convenience left to add). Kept
  `map`'s `reduce`/`some`/`every`/`findKey`/`findValue`/`hasValue` — those *do* still save a
  `[key, value]` tuple destructure over the native `map.entries().foo()` equivalent. Documented
  all of this (including what's *not* implemented and why) in `docs/native-alternatives.json`'s
  new `map`/`set` sections, consumed by the website build.
- [x] 🟡 **Number statistics: `median`, `percentile`, `meanBy`, `sumBy`** (2026-07-19) — added to
  `@helpers4/array` alongside the existing `mean`/`sum`. `percentile` uses linear interpolation
  between closest ranks (so `percentile(arr, 50)` matches `median`).
- [x] 🟢 **Bulk object-key case transforms** (2026-07-19, revised same day after review) — landed
  as **5** functions, not 2: `camelCaseKeys`, `snakeCaseKeys`, `kebabCaseKeys`, `pascalCaseKeys`,
  `titleCaseKeys` (renamed from the original `toCamelCaseKeys`/`toSnakeCaseKeys` — dropped the
  `to` prefix to match `@helpers4/string`'s own naming: `camelCase`/`snakeCase`/`kebabCase`, no
  `to`). Also added `@helpers4/object/mapDeep` — the recursive sibling to the existing `map`
  (same shallow/deep pairing convention as `clone`/`cloneDeep`) — and rebuilt all 5 `*Keys`
  functions as thin wrappers over it instead of each hand-rolling its own recursion.
  Found along the way: `@helpers4/string`'s `camelCase`/`kebabCase` are narrower than their
  siblings — `camelCase` only handles kebab-case input, `kebabCase` only handles
  camelCase/PascalCase input, unlike `snakeCase`/`pascalCase`/`titleCase` which all handle any
  input format. `snakeCaseKeys`/`pascalCaseKeys`/`titleCaseKeys` reuse those public (already
  robust) functions directly; `camelCaseKeys`/`kebabCaseKeys` use a local, equally-robust
  `words()`-based helper instead (`object/_caseKeysHelpers.ts`) so they work correctly regardless
  of whether/when `camelCase`/`kebabCase` themselves get fixed — see the follow-up item below.
  Also added `sortKeys` (shallow) as a closely-related function while in this area.
- [x] 🟡 **Fixed `@helpers4/string`'s `camelCase`/`kebabCase` narrowness** (2026-07-19) — both
  now tokenize the same way `snakeCase`/`pascalCase`/`titleCase` already did (handle
  snake_case/kebab-case/PascalCase/spaces, not just one specific input format each). Real
  **`BREAKING CHANGE`** to shipped functions (`@since 1.9.0`) — e.g. `camelCase('-leading')`
  now returns `'leading'`, not `'Leading'`; `camelCase('UPPER-CASE')` now returns `'upperCase'`,
  not `'UPPER-CASE'` unchanged. `camelCaseKeys`/`kebabCaseKeys` dropped their local
  `_caseKeysHelpers.ts` workaround (deleted) and now delegate to the public functions directly,
  same as the other three `*Keys` variants.
- [x] 🟢 **Environment/JSON guards** (2026-07-19) — added `isBrowser`, `isNode`, `isLength`,
  `isJSONValue`, `isJSONArray`, `isJSONObject` to `@helpers4/guard`. `isJSON` ended up with a
  more useful, distinct meaning than a plain alias: checks whether a **string** is valid
  parseable JSON (pairs with `@helpers4/object`'s `safeJsonParse`), rather than duplicating
  `isJSONValue`'s already-parsed-value shape check.
- [x] 🟡 **Concurrency primitives in `@helpers4/promise`** (2026-07-20) — added `createSemaphore`
  (limits concurrent holders to `permits`, FIFO-queueing excess `acquire()` callers) and
  `createMutex` (a semaphore with a single permit, for mutual exclusion — internally just
  `createSemaphore(1)` with a renamed `isLocked()` accessor instead of `available()`). Kept
  `delay`/`timeout`/`withTimeout` as-is — those already existed (the original gap-analysis entry
  was wrong on them, see below).
  Factory functions returning a closure-backed object, not `export class` — matches this
  package's other stateful helpers (`debounce`, `throttle`), so this isn't actually the "first
  stateful API" the original entry worried it'd be. `acquire()` resolves to a one-shot release
  function (not a bare `release(): void`) plus a `run(fn)` convenience that acquires, runs, and
  releases even if `fn` throws (mirrors `defer`'s try/finally guarantee) — `run()` is the
  documented preferred way to use either. **Revised (2026-07-21, code review)**: a bare shared
  `release()` counter can't tell a legitimate release from a double-release once there's
  contention — verified directly that a stray extra `release()` call could silently hand a
  phantom permit to an unrelated queued waiter, breaking mutual exclusion. Fixed by having
  `acquire()` resolve to a per-acquisition release function with its own already-released
  state, so a double-release is always caught, not just when the semaphore is fully idle.
- [x] 🟢 **Async-aware array iteration** (2026-07-20) — added `mapAsync`/`filterAsync`/
  `forEachAsync` to `@helpers4/array`, mirroring `Array.prototype.map`/`filter`/`forEach`'s
  calling convention (`(item, index) => ...`) directly against the array, instead of requiring
  callers to pre-wrap each item as a `() => Promise<T>` thunk for `parallel`. `concurrency` is
  optional (unlike `parallel`'s required `limit`) — omitted means unlimited, matching
  `Promise.all(array.map(fn))`; `0`/negative/`NaN` throw `RangeError` rather than silently
  falling back to a default, unlike `parallel`'s existing clamp-to-1 behavior (a deliberate,
  stricter contract for this new, optional parameter — not a change to `parallel` itself).
  Rejects on the first error, same as `Promise.all`/`parallel` (no settle/partition variant —
  use `parallelSettle` directly for that). Shared queueing logic lives in an in-category
  internal helper, `array/_concurrentMap.ts` (matches the `_sortHelpers.ts`/`_byAccessor.ts`
  convention), used by all three.
  **Revised (2026-07-21, code review)**: `runConcurrentMap` (used by `mapAsync`/`filterAsync`)
  now delegates its actual scheduling to `promise/parallel` instead of a second, independent
  worker-pool implementation — `concurrency` is validated/clamped first, so `parallel`'s own
  (more permissive) clamping never comes into play and its behavior for direct callers is
  unaffected. `forEachAsync` keeps its own lean loop via `runConcurrentEach`, since it has no
  use for `parallel`'s results array. Also found and fixed: the same Infinity-clamped-to-1 bug
  this entry's `parallel` comparison was written against also existed in `parallelSettle` —
  fixed there too. The "positive count, floor non-integer, throw on invalid" validation is now
  shared (`_shared/_validatePositiveCount.ts`) between `createSemaphore` and this file instead
  of two near-identical inline checks.
