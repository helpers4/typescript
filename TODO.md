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

---

## 3. v3 roadmap

> Last refresh: 2026-06-21.
> Scope: **breaking changes only** — non-breaking improvements land in 2.x.

### 3.1 Remove deprecated symbols 🔴

All these symbols are already marked `@deprecated "…will be removed in v3"` — remove them.

| Symbol | File | Deprecated since | Replacement |
| --- | --- | --- | --- |
| `isEmpty` | `type/isEmpty.ts` | 2.0.0 | `array/isEmpty`, `string/isEmpty`, `object/isEmpty` |
| `safeDate` | `date/safeDate.ts` | 1.9.0 | `ensureDate` |
| `dateToISOString` | `date/safeDate.ts` | 1.9.0 | `toISO8601` (date/format.ts) |
| `daysDifference` | `date/difference.ts` | 2.0.0 | `difference` |
| `deepClone` | `object/deepClone.ts` | next | `cloneDeep` |
| `deepMerge` | `object/deepMerge.ts` | next | `mergeDeep` |

- [ ] Delete all 6 symbols + their files/barrel exports
- [ ] Delete or migrate associated tests to the replacement
- [ ] Verify no internal helper still calls them

### 3.2 DEFAULT_SORT_STRING_PROPS 🟡

Décision à prendre : rester interne (état actuel depuis PR #95) ou promouvoir en API publique documentée dans v3.

- [ ] Confirmer le choix : interne définitif → rien à faire ; public → ajouter JSDoc complet sur `sort.ts` et `@since 3.0.0`

### 3.3 Promise helpers — nettoyage des signatures 🟡

`truthyPromiseOrThrow`, `falsyPromiseOrThrow`, `meaningPromiseOrThrow` ont tous des `as T` non-soundés et plusieurs `eslint-disable`. Le problème de fond : `T` n'est pas contraint et le cast est invisible à l'appelant.

- [ ] Revoir si `T` doit être contraint (`T extends object`, etc.) ou si le `as T` est remplaçable par une surcharge typée
- [ ] Supprimer les `eslint-disable` si le type devient sound, sinon ajouter un commentaire justificatif

### 3.4 isNonEmpty — cohérence des type guards 🟢

`array/isNonEmpty` retourne un type guard `[T, ...T[]]`. Les versions `string/isNonEmpty` et `object/isNonEmpty` n'ont pas de type guard.

- [ ] Décider si l'on ajoute `value is NonEmptyString` / `value is NonEmptyObject<T>` dans les versions string/object, ou si l'asymétrie est intentionnelle (documenter alors le choix)

### 3.5 DateLike / Temporal 🟢

`date/types.ts:30` a un TODO existant : quand Temporal atteint Stage 4, substituer `EpochMilliseconds` par `Temporal.Instant | Temporal.ZonedDateTime`.

- [ ] Surveiller l'avancement TC39 — actuellement Stage 3
- [ ] Quand disponible sans flag dans Node LTS + tous les evergreen browsers : remplacer le duck-type par les types Temporal concrets et supprimer l'interface `EpochMilliseconds`
