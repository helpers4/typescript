# TODO — `helpers4/typescript`

> Last refresh: 2026-05-13.

Legend: 🔴 High priority · 🟡 Medium · 🟢 Low

---

## 1. `type/` — gap fill

**Source:** [radashi-org/discussions#46](https://github.com/orgs/radashi-org/discussions/46#discussioncomment-11736331)
— comparison table of Radashi / another lib / `@sindresorhus/is` (~90 predicates).
Radashi won't act on this. helpers4 can close the relevant gaps since the design is already
tree-shakeable, browser-safe, and one-file-per-predicate.

> Note: `isNumber(NaN) === false` is already correct in helpers4 — not affected by Radash #405.

### 🔴 Numeric — common, frequently needed

| Helper | Implementation note |
|--------|---------------------|
| `isInteger` | `Number.isInteger(value)` — distinct from `isNumber` |
| `isNaN` | `Number.isNaN(value)` — safe version (not the legacy global) |
| `isSafeInteger` | `Number.isSafeInteger(value)` |
| `isInfinite` | `value === Infinity \|\| value === -Infinity` |

### 🔴 Collections — used widely

| Helper | Implementation note |
|--------|---------------------|
| `isSet` | `value instanceof Set` |
| `isWeakMap` | `value instanceof WeakMap` |
| `isWeakSet` | `value instanceof WeakSet` |
| `isWeakRef` | `value instanceof WeakRef` |

### 🟡 Numeric — nice-to-have

| Helper | Implementation note |
|--------|---------------------|
| `isEvenInteger` | `isInteger(n) && n % 2 === 0` |
| `isOddInteger` | `isInteger(n) && n % 2 !== 0` |

### 🟡 Iteration protocol

| Helper | Implementation note |
|--------|---------------------|
| `isAsyncIterable` | `Symbol.asyncIterator in Object(value)` |
| `isGenerator` | `Object.prototype.toString` → `[object Generator]` |
| `isGeneratorFunction` | `Object.prototype.toString` → `[object GeneratorFunction]` |
| `isAsyncGenerator` | `Object.prototype.toString` → `[object AsyncGenerator]` |
| `isAsyncGeneratorFunction` | `Object.prototype.toString` → `[object AsyncGeneratorFunction]` |

### 🟡 String specializations

| Helper | Implementation note |
|--------|---------------------|
| `isEmptyString` | `value === ''` |
| `isWhitespaceString` | `isString(value) && value.trim() === ''` |

> `isNonEmptyString` already exists.

### 🟡 Object / Array specializations

| Helper | Implementation note |
|--------|---------------------|
| `isEmptyArray` | `isArray(value) && value.length === 0` |
| `isEmptyObject` | `isPlainObject(value) && Object.keys(value).length === 0` |
| `isNonEmptyObject` | `isPlainObject(value) && Object.keys(value).length > 0` |

### 🟢 General purpose

| Helper | Implementation note |
|--------|---------------------|
| `isPropertyKey` | `isString(v) \|\| isNumber(v) \|\| isSymbol(v)` → `value is PropertyKey` |
| `isPromiseLike` | `value != null && typeof (value as any).then === 'function'` (thenable) |
| `isArrayLike` | `value != null && typeof (value as any).length === 'number'` |
| `isHtmlElement` | `typeof HTMLElement !== 'undefined' && value instanceof HTMLElement` — browser-only, document it |
| `isUrlInstance` | `value instanceof URL` |

### Explicitly out of scope

- Typed arrays (`Int8Array`, `Uint8Array`, etc.) — too niche, no tree-shaking benefit
- `isNodeStream`, `isSharedArrayBuffer` — Node.js specific
- `isObservable` — handled by the `observable/` category
- `isAll` / `isAny` / global `is` / `assert` — meta-predicates, different design surface
- `isClass`, `isBoundFunction`, `isTagged`, `isDirectInstanceOf`, `isEnumCase` — reflection / meta
- `isResult` / `isResultOk` / `isResultErr` — requires a Result type not shipped by this lib

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

1. **`type/` gap fill** — tackle §1 numeric + collection predicates first (high value, small effort).
   One file per predicate following the existing pattern.
2. **OpenSSF PRs C/D/E** — land in parallel, they don't conflict with the helper roadmap.
3. Open one issue per accepted helper in §1 with its source reference for traceability.
