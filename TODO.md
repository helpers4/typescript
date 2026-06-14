# TODO — `helpers4/typescript`

> Last refresh: 2026-06-14.

Legend: 🔴 High priority · 🟡 Medium · 🟢 Low

---

## 1. OpenSSF Scorecard

> Last snapshot: **6.7**. Goal: lift the score by closing the highest-impact
> checks first, while keeping CI behaviour stable.

### Priority 1 — `Code-Review`

- [ ] Confirm branch/ruleset settings on `main`:
  - PR required before merge
  - ≥1 required approving review
  - Stale approvals dismissed on new commits
  - Force pushes blocked
  - Direct pushes blocked (except explicit emergency admins)
- [ ] Maintainers do **not** bypass rules for normal merges.
- [ ] Merge several PRs with **human approvals** (not bot approvals); the
  Scorecard check is computed from recent merged changesets, so the score
  only moves once enough new reviewed merges replace older ones.
- [ ] Record evidence per PR (URL, reviewer login, merge timestamp).

### Priority 2 — `Token-Permissions`

- [ ] Verify no `no topLevel permission defined` warning remains.
- [ ] Confirm Scorecard `Token-Permissions` > 0.

### Priority 3 — `Pinned-Dependencies`

- [ ] Document the pinned-SHA update process (Dependabot/Renovate config).
- [ ] Confirm Scorecard no longer reports unpinned actions.

### Priority 4 — `Signed-Releases`

- [ ] Add release provenance generation to the release workflow.
- [ ] Attach attestation/signature assets to releases.
- [ ] Verify generated artifacts after release.
- [ ] Target: `Signed-Releases` ≥ 10.

### Priority 5 — `Branch-Protection`

- [ ] Add `SCORECARD_TOKEN` (fine-grained PAT, `Administration: Read-only`,
  `Metadata: Read-only` implicit, optional `Webhooks: Read-only`).
- [ ] Wire it into the Scorecard action workflow.
- [ ] Confirm `Branch-Protection` is scored (no `?` / token error).

### Priority 6 — `CII-Best-Practices`

- [ ] Register the project on `bestpractices.dev`.
- [ ] Complete passing → silver → gold criteria.
- [ ] Show the badge in the README.

### Rollout strategy

- [ ] PR C — release provenance / signature
- [ ] PR D — Scorecard token / auth visibility
- [ ] PR E — docs + best-practices badge links

After each PR, re-run Scorecard and capture the delta.

---

## 2. Suggested next steps

1. **OpenSSF PRs C/D/E** — land in parallel with the helper roadmap.
