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
  (2026-07-14). `llms-full.txt` / helpers4.dev version not done — low value until the site
  itself needs it.
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

- [ ] 🔴 Open "good first issue" labelled issues to attract first-timers — label exists and is
  unused; needs specific issue proposals (candidates to be drafted with maintainer sign-off
  before opening, since issue creation is a public action). Candidate: missing `.bench.ts` files
  (202/241 helpers currently lack one — optional per CONTRIBUTING.md, low-risk starter task).
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

- [ ] 🟡 Improve mutation score — check current score on the
  [Stryker dashboard](https://dashboard.stryker-mutator.io/reports/github.com/helpers4/typescript/main)
  first to decide whether/where the effort is worth it.
- [ ] 🟡 Verify browser compatibility — check `tsconfig.json` `target`/`lib`, confirm no
  Node-only APIs leak outside `helpers/node/`, consider a browserslist/compat report.
- [ ] 🟢 Publish packages to JSR in addition to npm — needs a `jsr.json` per package and a check
  against JSR's "slow types" restriction (likely close to compliant already, given strict typing
  via tsgo).

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
