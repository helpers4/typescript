# TODO — `helpers4/typescript`

> Last refresh: 2026-07-21.

Legend: 🔴 High priority · 🟡 Medium · 🟢 Low

Only open items live here. Anything finished is in git history / `CHANGELOG.md` /
`MIGRATION.md`, not duplicated in this file.

---

## AI-friendliness / discovery

- [ ] 🟢 List helpers4 on general (non-AI) TypeScript discovery sites — the previously-suggested
  target (`dzharii/awesome-typescript`) is archived/read-only as of 2026-02-11. Needs a
  currently-maintained curated TS list found and confirmed active first.
- [ ] 🟢 Package `/add-helper` (or the consumer-facing skill below) as a real Claude Code plugin
  and submit to
  [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) —
  only makes sense for the consumer-facing skill; `/add-helper` is project-scoped and gains
  nothing from external listing.
- [ ] 🟢 **Consumer-facing Claude Code skill** (not built — needs a design pass): unlike
  `/add-helper` (helps people contribute *to* this repo), this would help people *using*
  `@helpers4/*` avoid reinventing a utility that already exists here.
  - Source of truth: the per-package `llms.txt` already generated at build time — no new data
    pipeline needed.
  - Distribution is the hard part (same blocker as the outreach item below): needs an actual
    channel — a plugin/marketplace listing, or a `CONTRIBUTING.md`/README install step — not just
    dropped in this repo's `.claude/skills/`, which only reaches people already working *in* this
    repo. Worth prototyping once that channel exists, not before.

---

## Contributors / outreach

> Blocked while the project is solo. One regular collaborator unlocks the `Code-Review`
> Scorecard check (~+2 pts) and makes human review possible.

- [ ] 🔴 Mention the project across TS/JS communities — outreach, not something an agent can do
  on the maintainer's behalf. Checked 2026-07-21, concrete targets:
  - PR to [`sorrycc/awesome-javascript`](https://github.com/sorrycc/awesome-javascript) (active,
    last push same day) — one entry, `[PACKAGE](LINK) - DESCRIPTION.` per its `CONTRIBUTING.md`.
    Also covers **LibHunt** for free — it auto-indexes from this exact list, no separate
    submission there.
  - Post to r/typescript + r/javascript, Discord, X/Twitter.
  - Write a "Why Helpers4?" article, cross-post to Dev.to + Hashnode + LinkedIn.
  - Show HN — one-shot and timing-sensitive (can't really redo it), but real upside if the
    article above gives it something to point to.
  - **DevHunt** (dev-tool-focused Product Hunt alternative, PR-based submission) instead of
    Product Hunt itself — Product Hunt expects a fresh-launch narrative that a library shipped
    as v3 months ago doesn't have; DevHunt doesn't.
  - Add relevant GitHub Topics tags to the repo (`typescript`, `utility-library`, …) — free,
    self-service, no external submission.
  - **Checked and rejected, don't re-research these**: Openbase (shut down 2023, domain dead),
    Open Source Agenda (domain expired, now redirects off-site), npmcompare.com (unreachable),
    "JS Toolbox" and "Perf-Track JS" (no such submittable sites exist), StackShare (built for
    companies listing their stack, not devs promoting a library), BetaList (explicitly
    pre-launch-only by their own criteria — disqualified), Indie Hackers (monetization-focused
    community, OSS-lib posts are off-topic), Lobsters (invite-only, drive-by self-promo gets
    flagged — only viable via genuine organic participation, not as a submission channel),
    "Claude/Agent Skills Marketplace" (not a real distinct product, and out of scope anyway —
    helpers4 is a TS library, not a Claude plugin).
- [ ] 🟡 Once a regular reviewer joins: raise `required_approving_review_count` to `1` on `main`,
  record evidence (URL/reviewer/timestamp) per merged PR — unlocks `Code-Review` scoring.

---

## OpenSSF Scorecard

> Live score: `curl -s https://api.securityscorecards.dev/projects/github.com/helpers4/typescript`.

- [ ] 🟡 Token-Permissions and Branch-Protection fixes (PRs #108/#109) are unverified against the
  live repo config — `gh api repos/helpers4/typescript/rulesets` returned `[]` on 2026-07-19, but
  the token used lacks admin rights to tell "no rules" from "no permission to see them." Needs a
  maintainer check with an admin token.
- [ ] 🟢 CII-Best-Practices Silver/Gold — deferred, needs sustained contributor activity.

---

## Code quality & tooling

- [ ] 🟡 **Browser compatibility gap**: the `Temporal`-based date helpers (`ensureDate`, `range`,
  `timeAgo`, `formatDuration`, `timezone` + 6 `guard/isTemporal*`) claim `ES2022+` support but
  `Temporal` isn't in ES2022 and **Safari has no stable support** yet (WebKit signals "late
  2026"). CI never tests an actual browser. **Needs a maintainer decision**: document the Safari
  caveat, scope the `browser` claim down, or accept a polyfill as an optional peer dependency for
  `date`/`guard`.
- [ ] 🟡 **`.d.ts` emit blocked** on TypeScript 7: `rollup-plugin-dts` needs the classic Compiler
  API, which TS 7.0's main export no longer exposes at all outside `unstable/*`. Tracked upstream
  at [Swatinem/rollup-plugin-dts#395](https://github.com/Swatinem/rollup-plugin-dts/issues/395)
  (maintainer has a working fix on a branch, not yet merged). Revisit once that ships, or once
  TS 7.1 delivers a stable new API.

---

## Future / needs design discussion

- [ ] 🟢 New "settings" package for shared tool configs (vite/vitest/oxc/lint/cspell…), customized
  for helpers4/baxyz instead of a third-party preset. Not a `helpers/` category — configs don't
  tree-shake like functions — needs a design decision on package/repo shape before implementation.
