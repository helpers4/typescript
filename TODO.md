# TODO — `helpers4/typescript`

> Last refresh: 2026-06-14.

Legend: 🔴 High priority · 🟡 Medium · 🟢 Low

---

## 1. `isEmpty` — split by category

**Current state:** `type/isEmpty` is a monolithic helper covering string, array, Map, Set, and plain
objects in a single function.

**Decision:** `isEmpty` checks *state*, not *type* — it does not belong in `type/`. Each category
should own its focused predicate. See the **Helper Placement** rule in `AGENTS.md`.

**Planned helpers:**

- **`isEmpty`** (`array/`) — `Array.isArray(value) && value.length === 0`
- **`isEmpty`** (`string/`) — `value === ''`
- **`isEmpty`** (`object/`) — `isPlainObject(value) && Object.keys(value).length === 0`
- **`isNonEmpty`** (`array/`) — inverse; complements `isNonEmptyArray` currently in `type/`
- **`isNonEmpty`** (`object/`) — inverse

**Open questions before implementation:**

- [ ] Deprecate or keep `type/isEmpty`? (currently the only multi-type predicate — exception to the rule)
- [ ] Should `isNonEmptyArray` and `isNonEmptyString` (currently in `type/`) move to `array/` and `string/`?
- [ ] Naming: `object/isNonEmpty` vs `object/isNonEmptyObject`?

---

## 2. OpenSSF Scorecard

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

## 3. Suggested next steps

1. **`isEmpty` split** — create `array/isEmpty`, `string/isEmpty`, `object/isEmpty`; resolve open questions (§1).
2. **OpenSSF PRs C/D/E** — land in parallel, they don't conflict with the helper roadmap.
