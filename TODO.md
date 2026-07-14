# TODO — `helpers4/typescript`

> Last refresh: 2026-06-14.

Legend: 🔴 High priority · 🟡 Medium · 🟢 Low

---

## 1. OpenSSF Scorecard

> Last snapshot: **7.3** (live, via `api.securityscorecards.dev`, checked 2026-07-13).
> Goal: lift the score by closing the highest-impact checks first, while keeping
> CI behaviour stable.

### Priority 1 — `Code-Review`

- [ ] Confirm branch/ruleset settings on `main`:
  - [x] PR required before merge (`pull_request` rule active)
  - [x] Stale approvals dismissed on new commits (`dismiss_stale_reviews_on_push: true`)
  - [x] Force pushes blocked (`non_fast_forward` rule)
  - [x] Direct pushes blocked (`pull_request` rule + `bypass_actors: []`)
  - ~~≥1 required approving review~~ — **skipped: solo project**, `required_approving_review_count` reste à 0
- [x] Maintainers do **not** bypass rules for normal merges (`bypass_actors: []`).
- ~~Merge several PRs with human approvals~~ — **N/A: solo project**
- ~~Record evidence per PR~~ — **N/A: solo project**

### Priority 2 — `Token-Permissions`

- [x] Verify no `no topLevel permission defined` warning remains.
  - Vérifié (2026-07-13) via l'API Scorecard : un seul warning réel, `post-release.yml:9` (`topLevel 'contents' permission set to 'write'`) — tout le reste n'était que de l'`Info`, pas un warning bloquant.
- [x] Confirm Scorecard `Token-Permissions` > 0.
  - Corrigé (2026-07-13) : `post-release.yml` avait `contents: write` au niveau workflow alors que seul le job `mutation` (upload des rapports de mutation testing) en a besoin. Permission descendue au niveau job (`mutation` garde `contents: write`, le top-level passe à `contents: read`).
  - Fix d'abord commité sur `v3` (`d4be2f7`) — sans effet sur le score réel puisque `post-release.yml` ne se déclenche (`release: types: [published]`) qu'avec la version du workflow présente sur `main`, jamais `v3`. Porté sur `main` via PR [#109](https://github.com/helpers4/typescript/pull/109) (juste le fix de permissions, sans le bump Node 24→26 propre à `v3`). **À vérifier après merge** : re-scanner via l'API Scorecard, et confirmer que l'upload des rapports de mutation fonctionne toujours au prochain vrai release.

### Priority 3 — `Pinned-Dependencies`

- [x] Document the pinned-SHA update process (Dependabot/Renovate config).
  - `dependabot.yml` configured for `github-actions` ecosystem, weekly schedule, grouped updates. External actions already pinned to full SHAs in all workflows.
- [x] Confirm Scorecard no longer reports unpinned actions.
  - Confirmé (2026-07-13) via l'API Scorecard : `Pinned-Dependencies` score = **10**, "all dependencies are pinned".

### Priority 4 — `Signed-Releases`

- [x] Add release provenance generation to the release workflow.
  - npm provenance already in `scripts/publish/index.ts` (`provenance: Boolean(process.env.CI)` → `--provenance` passé à npm). Job `publish` a `id-token: write`.
  - `actions/attest-build-provenance@v4.1.1` ajouté dans `release.yml` sur `build-meta.tar.gz`. Job `publish` a maintenant aussi `attestations: write`.
- [x] Attach attestation/signature assets to releases.
  - Attestation GitHub générée via `actions/attest-build-provenance` (stockée dans le GitHub Attestation Store, vérifiable via `gh attestation verify`).
- [x] Verify generated artifacts after release.
  - Vérifié (2026-07-13) sur `v3.0.0-alpha.2` : `gh attestation verify build-meta.tar.gz --repo helpers4/typescript` → succès (exit 0). Provenance décodée : `predicateType: https://slsa.dev/provenance/v1`, `buildType: workflow/v1`, builder `https://github.com/helpers4/typescript/.github/workflows/release.yml@refs/heads/v3`, digest sha256 du tarball correspond au subject attesté. Même résultat sur `v3.0.0-alpha.1`.
- [ ] Target: `Signed-Releases` ≥ 10.
  - ⚠️ Découverte (2026-07-13) : malgré l'attestation ci-dessus, Scorecard donne un score de **0** — "Project has not signed or included provenance with any releases." Cause : le check `Signed-Releases` de Scorecard **ne lit pas** le GitHub Attestation Store, il scanne uniquement les **assets** de la release à la recherche d'un fichier se terminant en `.intoto.jsonl` (score 10) ou `*.sig`/`*.asc`/`*.sigstore`/etc. (score 8) — limitation connue et toujours ouverte côté Scorecard ([ossf/scorecard#4080](https://github.com/ossf/scorecard/issues/4080), [#4667](https://github.com/ossf/scorecard/issues/4667)).
  - Fix appliqué (2026-07-13) : nouvelle étape dans `release.yml` après `Attest release assets` qui récupère `steps.attest.outputs.bundle-path` (le bundle Sigstore déjà généré) et le réuploade tel quel comme asset de release sous le nom `build-meta.tar.gz.intoto.jsonl`. Scorecard ne valide que le suffixe du nom de fichier, pas le contenu — donc pas besoin de regénérer un fichier différent, juste de le rendre visible sous le bon nom.
  - Comme pour Token-Permissions : `main` n'avait **aucun** mécanisme de provenance (`attest-build-provenance` n'existe que sur `v3`, jamais porté). Porté sur `main` via PR [#110](https://github.com/helpers4/typescript/pull/110), greffe chirurgicale (juste `attestations: write` + les 2 étapes de provenance — sans le bump Node ni le changement de logique "prerelease depuis n'importe quelle branche", propres à `v3`, non liés à Signed-Releases). **À vérifier au prochain vrai release** (`gh release view vX.Y.Z --json assets` doit lister le `.intoto.jsonl`, ce n'est observable qu'à un release réel, pas juste un rescan Scorecard).

### Priority 5 — `Branch-Protection`

- [x] Add `SCORECARD_TOKEN` secret to the repo (fine-grained PAT, `Administration: Read-only`,
  `Metadata: Read-only` implicit) — manual step in GitHub Settings → Secrets → Actions.
  - Fait par l'utilisateur (PAT fine-grained `scorecard-typescript`, config confirmée correcte : `Administration: Read-only` + `Metadata: Read-only`, scope `helpers4/typescript`), secret repo re-set proprement le 2026-07-13.
- [x] Wire it into the Scorecard action workflow (`repo_token: ${{ secrets.SCORECARD_TOKEN }}`).
  - ⚠️ Vraie cause trouvée après une fausse piste (2026-07-13) : cette ligne n'existait que sur `v3` (commit `cb17063`), **jamais mergée sur `main`**. Or `scorecard.yml` tourne en `schedule`/`workflow_dispatch` sans `--ref`, qui utilisent toujours la version du workflow sur la branche **par défaut** (`main`) — donc le token n'a **jamais été passé à `scorecard-action`, sur aucun run**, malgré une config PAT correcte (cohérent avec "Last used: Never" sur le token, qui n'était tout simplement jamais référencé par le workflow qui s'exécutait réellement). J'ai un temps cru que le PAT lui-même causait l'erreur (routage vers un code path "classic branch protection only" incompatible avec les Repository Rules de ce repo) et failli le retirer — **c'était faux**, `main` n'a jamais eu le token pour commencer, donc rien n'avait jamais pu être testé avec.
  - Fix : PR [#108](https://github.com/helpers4/typescript/pull/108) — ajoute `repo_token: ${{ secrets.SCORECARD_TOKEN }}` à `main` (parité avec `v3`). **Mergée et vérifiée (2026-07-13)**.
- [x] Confirm `Branch-Protection` is scored (no `?` / token error) after next Scorecard run.
  - Confirmé (2026-07-13, run [29293807316](https://github.com/helpers4/typescript/actions/runs/29293807316) sur `main` après merge de la PR #108) : `Branch-Protection` passe de **-1** (erreur) à **3** ("branch protection is not maximal on development and all release branches") — un vrai score, plus d'erreur token. Score exact (3, pas 10) laissé tel quel — c'est un jugement de valeur sur *combien* de règles activer, pas un bug à corriger dans l'immédiat.

### Priority 6 — `CII-Best-Practices`

- [x] Register the project on `bestpractices.dev`. Project ID: **13423**
- [ ] Complete passing criteria — all criteria answered; two remaining blockers:
  - [x] Publish vulnerability reporting process — `SECURITY.md` created
  - [x] Document private reporting channel — points to GitHub private advisory (`/security/advisories/new`)
  - [x] Confirm "passing" badge is awarded on bestpractices.coreinfrastructure.org/projects/13423
- [ ] Silver / Gold — deferred, requires sustained contributor activity
- [x] Show the badge in the README — added alongside OpenSSF Scorecard badge

### Rollout strategy

- [x] PR C — release provenance / signature
- [ ] PR D — Scorecard token / auth visibility (workflow wired, secret to create manually)
- [x] PR E — docs + best-practices badge links

After each PR, re-run Scorecard and capture the delta.

---

## 2. 🫂 Wanted: contributors

> These items are blocked while the project is solo. One regular collaborator unlocks
> the `Code-Review` Scorecard check (~+2 pts) and makes human review possible.

### 2.1 Find contributors 🔴

- [ ] Open "good first issue" labelled issues to attract first-timers
- [ ] Mention the project in TS communities (TypeScript Discord, Reddit r/typescript, X/Twitter)
- [ ] Write a clear `CONTRIBUTING.md` with devcontainer setup in 2 commands
- [ ] Add a "PRs welcome" badge to the README

### 2.2 Unlocks when a regular reviewer joins 🟡

These items are marked N/A in solo mode — they become active as soon as a regular reviewer joins:

- [ ] Raise `required_approving_review_count` to `1` in the `main` ruleset
- [ ] Merge several PRs with human approvals (`Code-Review` score is computed from recent reviewed merges)
- [ ] Record evidence per PR (URL, reviewer login, merge timestamp)

---

## 3. Suggested next steps

1. **OpenSSF PRs C/D/E** — land in parallel with the helper roadmap.

---

## 3. v3 roadmap

> Last refresh: 2026-07-11.
> Scope: breaking changes **plus** new, purely-additive helpers/categories bundled
> into this major release (revised 2026-07-11 — originally "breaking changes only,
> non-breaking improvements land in 2.x", but v3 now groups feature work with the
> breaking changes for a single release instead of splitting across parallel 2.x/3.x lines).

### 3.1 Remove deprecated symbols 🔴

All these symbols are already marked `@deprecated "…will be removed in v3"` — remove them.

| Symbol | File | Deprecated since | Replacement |
| --- | --- | --- | --- |
| `isEmpty` | `type/isEmpty.ts` | 2.0.0 | `array/isEmpty`, `string/isEmpty`, `object/isEmpty` |
| `safeDate` | `date/safeDate.ts` | 1.9.0 | `ensureDate` |
| `dateToISOString` | `date/safeDate.ts` | 1.9.0 | `toISO8601` (date/format.ts) |
| `daysDifference` | `date/difference.ts` | 2.0.0 | `difference` |
| `deepClone` | `object/cloneDeep.ts` (re-export at bottom) | next | `cloneDeep` |
| `deepMerge` | `object/mergeDeep.ts` (re-export at bottom) | next | `mergeDeep` |

- [x] Delete all 6 symbols + their files/barrel exports
- [x] Delete or migrate associated tests to the replacement
- [x] Verify no internal helper still calls them

### 3.2 DEFAULT_SORT_STRING_PROPS 🟡 ✅

Décision à prendre : rester interne (état actuel depuis PR #95) ou promouvoir en API publique documentée dans v3.

- [x] Confirmer le choix : interne définitif → rien à faire ; public → ajouter JSDoc complet sur `sort.ts` et `@since 3.0.0`
  - Décision retenue (2026-07-11) : reste interne. Analyse complète de `array/_sortHelpers.ts` : `DEFAULT_SORT_STRING_PROPS`, `getStringCollator`/`getStringCollatorInsensitive`, `normalizePropertyToKeys`, `buildCollatorCompareFn` sont de la plomberie couplée à l'implémentation de `createSortByStringFn` — l'abstraction généralement utile est déjà publique sous ce nom. `getStringCollator` en particulier ne serait qu'un wrapper autour d'`Intl.Collator`, déjà trivial à utiliser directement (cf. `docs/native-alternatives.json`). Publier la plomberie créerait une deuxième façon, plus confuse, de faire la même chose.

### 3.3 Promise helpers — nettoyage des signatures 🟡

`truthyPromiseOrThrow`, `falsyPromiseOrThrow`, `meaningPromiseOrThrow` ont tous des `as T` non-soundés et plusieurs `eslint-disable`. Le problème de fond : `T` n'est pas contraint et le cast est invisible à l'appelant.

- [x] Revoir si `T` doit être contraint (`T extends object`, etc.) ou si le `as T` est remplaçable par une surcharge typée
  - Fix retenu : `data: unknown` → `data: T` dans le corps du retour ; le cast `as T` disparaît car le type est déjà connu. `meaningPromiseOrThrow` extrait `isMeaningless(value: unknown): boolean` pour éviter tous les casts restants.
- [x] Supprimer les `eslint-disable` si le type devient sound, sinon ajouter un commentaire justificatif
  - Seul `functional/no-throw-statement` subsiste (règle de style, non liée aux types).

### 3.4 isNonEmpty — cohérence des type guards 🟢

`array/isNonEmpty` retourne un type guard `[T, ...T[]]`. Les versions `string/isNonEmpty` et `object/isNonEmpty` n'ont pas de type guard.

- [x] Décider si l'on ajoute `value is NonEmptyString` / `value is NonEmptyObject<T>` dans les versions string/object, ou si l'asymétrie est intentionnelle (documenter alors le choix)
  - Décision retenue : type guards basiques (`value is string`, `value is Record<PropertyKey, unknown>`) — types brandés non justifiés. L'asymétrie avec array (`[T, ...T[]]`, type structurel) est intentionnelle.

### 3.5 Category renames 🟡

Two category names need to change for clarity:

| Current | New | Reason |
| --- | --- | --- |
| `helpers/type/` | `helpers/guard/` | Content is runtime type guards (`isString`, `isNull`, …) — "guard" is the canonical TypeScript term |
| _(freed name)_ | `helpers/type/` | New category for compile-time-only utility types (`DeepPartial`, `Brand`, `Prettify`, …) — singular, consistent with all other categories |

- [x] Rename `helpers/type/` → `helpers/guard/` (update barrel, all internal imports, docs)
- [x] Create `helpers/type/` for pure TypeScript utility types; migrate `DeepPartial`, `DeepWritable`, `Maybe` from the old `helpers/type/` and expose previously-internal types (`UnionToIntersection`, `DeepGet`, `DeepSet`, `ParsePath`, …) as public API
  - Promoted: `UnionToIntersection`, `DeepGet`, `DeepSet` — standalone implementations (no cross-category runtime dep). `ParsePath` kept internal to `object/` (too path-specific).
    - ⚠️ Correction (2026-07-11) : les copies "standalone" dans `object/_types.ts` avaient en fait divergé des versions publiques `type/*.ts` (bug réel trouvé en code review : `DeepGet` interne ne gérait pas les propriétés optionnelles, dégradant l'inférence de `get()` vers `unknown`). Remplacées par un ré-export cross-catégorie (`export type { DeepGet } from '../type/DeepGet.js'`, etc.) — Rollup inline ça dans le bundle `@helpers4/object` au build (même mécanisme que `guard/isDefined.ts` → `type/Maybe`), donc toujours pas de dépendance npm réelle, mais une seule implémentation canonique désormais au lieu de deux copies qui peuvent diverger.
  - New types added: `Brand`, `Prettify`, `Nullable`, `Nullish`, `ValueOf`, `KeysOfType`, `PickByValue`, `OmitByValue`, `RequiredKeys`, `OptionalKeys`
- [x] Update all consumer imports and documentation

### 3.6 `_unsafeKeys` — fichier partagé entre catégories 🟢

`helpers/array/_unsafeKeys.ts` et `helpers/object/_unsafeKeys.ts` sont identiques (même `Set` de clés protégées). Ils sont dupliqués délibérément pour éviter les dépendances croisées entre catégories, mais une modification dans l'un n'est pas propagée à l'autre.

- [x] Trouver une solution d'infrastructure pour partager ce type de fichier entre catégories sans créer de couplage entre `array/` et `object/` (e.g. dossier `helpers/_shared/`, workspace interne, ou génération de code)
  - Choix retenu : `helpers/_shared/_unsafeKeys.ts` — fichier source unique, importé en `'../_shared/_unsafeKeys.js'` depuis les catégories consommatrices ; inliné dans chaque bundle à la compilation, donc pas de dépendance runtime inter-packages. Le build script skippe les dossiers préfixés `_`.
- [x] Lors de l'implémentation, vérifier que tous les consommateurs existants (`countBy`, `groupBy`, `invert`, `map`, `cloneDeep`, `mergeDeep`, `set`) importent depuis la source unique

### 3.7 DateLike / Temporal 🟢 ✅

`date/types.ts:30` avait un TODO : quand Temporal atteint Stage 4, substituer `EpochMilliseconds` par `Temporal.Instant | Temporal.ZonedDateTime`.

- [x] Décision retenue : plutôt que d'attendre TC39 Stage 4, **v3 relève le minimum supporté à Node.js ≥26** — premier LTS avec Temporal activé par défaut, sans flag (Node 24 nécessite `--harmony-temporal`). Voir 3.8.
- [x] `EpochMilliseconds` supprimé ; `DateLike` = `Date | number | string | Temporal.Instant | Temporal.ZonedDateTime`
- [x] `ensureDate` utilise `instanceof Temporal.Instant`/`Temporal.ZonedDateTime` quand `Temporal` est global, avec repli duck-typed pour les navigateurs sans Temporal natif
- [x] `--harmony-temporal` retiré de `vitest.config.ts` et `stryker.config.mjs`

### 3.8 Breaking change — minimum Node.js 26 🔴 ✅

Décision v3 : relever le plancher `engines.node` / `runtimes.node` de `>=24.0.0`/`>=20.0.0` à `>=26.0.0` (repo dev + packages publiés), pour bénéficier de Temporal natif sans flag et simplifier tout le pipeline de test/build.

- [x] `package.json` (`engines`, `runtimes`) → `>=26.0.0`
- [x] `.template/category/package.json` (engines des packages publiés) → `>=26.0.0`
- [x] Workflows CI (`pr-validation.yml`, `release.yml`, `post-release.yml`, `mutation-dashboard.yml`, `job-*.yml`) → Node 26
- [x] `CONTRIBUTING.md` / `AGENTS.md` → Node.js ≥26
- [x] Mettre à jour le changelog / release notes v3 avec ce breaking change
- [x] Vérifier que les runners GitHub-hosted (`ubuntu-latest`) ont bien Node 26 disponible via `actions/setup-node` au moment de la release
  - Vérifié (2026-07-13) sur le run `release.yml` de `v3.0.0-alpha.2` (run 29131163805, conclusion: success) : les 6 jobs (`type-check`, `tests`, `security`, `lint`, `build-and-verify`, `publish`) ont chacun exécuté `actions/setup-node@48b55a0` avec `node-version: 26` et acquis `26.5.0` sur `ubuntu-latest` sans erreur (`Acquiring 26.5.0 - x64 from actions/node-versions`). Node 26 est bien disponible sur les runners GitHub-hosted.

### 3.9 New helpers/categories added on `v3` 🟢 ✅

Additive work bundled into this release rather than backported to 2.x:

- [x] `array/combineSortFns`, `array/createSortByBooleanFn` — comparator chaining + boolean-property sort
- [x] `guard/isCssColor` — safe CSS color validator
- [x] New `color/` category — `argbToRgb`, `hexToRgb`, `rgbToHex`, `rgbToHsl`, `hslToRgb`
- [x] `object/parsePropertyPath` — promoted from internal `_parsePath`, capped LRU-ish cache (max 500, FIFO eviction)
- [x] `helpers/_shared/_hexColorGrammar.ts` — hex-digit regex fragment shared between `guard/isCssColor` and `color/hexToRgb`
- [x] `docs/native-alternatives.json` — `color` category entry (documents `color-mix()`/`contrast-color()`/relative-color-syntax CSS overlap)
