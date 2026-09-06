# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Upgrading a major version? See [MIGRATION.md](MIGRATION.md).


## [3.1.2] - 2026-09-06

### 🚀 Features
- **license**: add families, agree, isKnown — new category
- **string**: add excerpt, cross-reference from truncate

### 🐛 Bug Fixes
- **CI-CD**: make post-build smoke tests actually execute the compiled code
- **CI-CD**: externalize Node builtins so @helpers4/node doesn't ship broken

### 🔧 Miscellaneous
- register the license commit scope

## [3.1.1] - 2026-09-05

### 🚀 Features
- **array**: add findMap
- **node**: add withTempDir
- **string**: add levenshteinDistance/levenshteinSimilarity, globToRegExp, unorderedPairKey

### 🐛 Bug Fixes
- address code review findings on the tuxery-extracted helpers

### 🔧 Miscellaneous
- **deps-dev**: bump happy-dom

## [3.1.0] - 2026-09-05

### 🚀 Features
- **CI-CD**: publish and validate the helpers4 unified package
- **CI-CD**: build a helpers4 unified package alongside @helpers4/all

### 🐛 Bug Fixes
- **CI-CD**: catch a never-published package before a release starts
- **helpers4**: stop llms.txt telling helpers4 users to install @helpers4/
- **security**: raise the qs override to patch 2 moderate advisories
- **version**: avoid the TSNonNullExpression+UpdateExpression pattern that crashes stryker 10
- address code review findings on the helpers4 unified package

### 🔧 Miscellaneous
- **deps-dev**: bump the dev-dependencies group across 1 directory with 5 updates
- **deps-dev**: bump the dev-dependencies-major group with 2 updates
- register the helpers4 commit scope

### 📝 Documentation
- **helpers4**: document the unified package as an install option

### 📌 Dependencies
- **deps**: bump github/codeql-action/upload-sarif in the actions group

## [3.0.9] - 2026-08-30

### 🚀 Features
- **CI-CD**: add a resume release_type to finish a partially-published release
- **CI-CD**: add unpublish-version script for cleaning up failed releases
- **array**: add uniqueBy to dedupe by a derived key
- **array**: add maxBy/minBy to pick an item by a derived key
- **guard**: add isWeakMapKey
- **number**: add unitSeparator and integerBelowFirstUnit options to formatSize
- **structure**: add createUnionFind, new "structure" category
- **version**: make increment/satisfiesRange/incrementPrerelease gentoo-compatible
- **version**: add Gentoo/Portage scheme support to parse/compare/stringify

### 🐛 Bug Fixes
- **CI-CD**: stop auto-rollback from burning npm version numbers forever
- **CI-CD**: reject a conflicting --version instead of silently overwriting it
- **CI-CD**: close a command-injection path in packageVersionExists
- **function**: widen createCachedResolver's WeakMap overload to K extends WeakKey
- **function**: accept function/symbol keys in createCachedResolver's WeakMap guard
- **string**: escape zero-width chars in isBlank's JSDoc regex example
- **version**: resolve ParsedVersion breaking change, unify isPrerelease's dispatch
- **version**: render the actual bad value in assertNeverScheme's error message
- **version**: make isPrerelease scheme-aware, fixing a Gentoo misclassification

### 🔧 Miscellaneous
- **deps-dev**: bump the dev-dependencies group across 1 directory with 8 updates
- **deps-dev**: bump the dev-dependencies group with 2 updates
- **deps-dev**: bump the dev-dependencies group with 4 updates

### ♻️ Refactoring
- **CI-CD**: dedupe UnpublishResult as an alias of PublishResult
- **CI-CD**: dedupe typeParams-to-generics serialization in website metadata
- **structure**: collapse redundant branch in createUnionFind's union-by-rank
- **version**: dispatch on scheme via switch instead of a ternary

### 📝 Documentation
- **version**: add missing @since tags to GentooSuffixType/GentooSuffix
- note the isPrerelease omission in the version-scheme checklist
- document the 5 remaining version schemes to build later

### 📌 Dependencies
- **deps**: bump the actions group across 1 directory with 2 updates
- **deps**: bump github/codeql-action/upload-sarif in the actions group

## [3.0.7] - 2026-08-08

### 🚀 Features
- **function**: add createCachedResolver helper

### 🐛 Bug Fixes
- **CI-CD**: fix generics, companion-type attachment and @since guard in website metadata
- **function**: cover null-key branch in createCachedResolver's WeakMap guard
- **function**: fix createCachedResolver cache-sharing, reentrancy and key-type bugs
- **security**: bound the nanoid override to 3.x
- **security**: patch 3 newly-published CVEs (fast-uri, brace-expansion, nanoid)
- stop dropping companion types without their own @since tag

### 🔧 Miscellaneous
- **CI-CD**: separate major bumps from minor/patch in dependabot groups
- **CI-CD**: group major-version dependency bumps too, group devcontainer updates
- **deps-dev**: bump vite in the dev-dependencies group
- **scorecard**: bump codeql-action/upload-sarif to v4.37.4

### 📝 Documentation
- **string**: make TrimMode's docs public, cross-link trim/trimStart/trimEnd

### ✅ Tests
- **function**: fix createCachedResolver benchmarks to measure steady-state cost

## [3.0.6] - 2026-07-29

### 🚀 Features
- **node**: make safeReadJsonFile tolerate JSONC
- **node**: add safeReadJsonFile helper
- **string**: truncate() never cuts inside a grapheme cluster
- **string**: add trim/trimStart/trimEnd with a configurable TrimMode

### 🐛 Bug Fixes
- **CI-CD**: re-pin dispatch-with-fallback to main SHA after #15 merged
- **CI-CD**: grant pull-requests:write to pr-comment job
- **node**: stop JSONC line comments at bare \r, not just \n
- **string**: validate mode directly in trim(), not just via delegation
- **string**: fix truncate() algorithmic complexity on pathological input
- **string**: throw on an invalid TrimMode instead of silently no-op-ing
- **string**: give trim() a single-call native fast path
- **string**: add missing PURE annotations to TRIM_END/START_REGEX
- **string**: fix truncate() surrogate splitting, stop stripping NBSP
- **string**: trim trailing whitespace before truncate()'s ellipsis [**BREAKING**]

### 🔧 Miscellaneous
- **CI-CD**: remove dead job-pr-comment.yml workflow
- **deps-dev**: bump the dev-dependencies group across 1 directory with 3 updates

### ♻️ Refactoring
- **CI-CD**: adopt renamed dispatch-with-fallback action
- **CI-CD**: adopt helpers4/action setup-pnpm/pr-status-comment/trigger-website-update

### 📝 Documentation
- add new TODO items for cross-category name collisions and @helpers4/all installation issue

### ✅ Tests
- **node**: add benchmark for safeReadJsonFile

## [3.0.5] - 2026-07-26

### 🐛 Bug Fixes
- **CI-CD**: include llms.txt in the website build-metadata artifact
- fix tree-shaking dead-code leak and CI security-audit failure
- correct public author email to craft@baxyz.dev
- update categories in documentation to include 'map' and 'set' utilities

### 📝 Documentation
- update TODO.md with recent changes and fixes
- have /add-helper check benchmark convention per category
- mark llms.txt discovery-directory submission done
- record the llms-full.txt staleness saga and its fixes

### ✅ Tests
- **array**: add missing benchmarks for the new stats/async-iteration helpers
- **map**: add benchmarks for all 11 functions
- **object**: add missing benchmarks for mapDeep, sortKeys, and the *CaseKeys helpers
- **promise**: add benchmarks for createMutex and createSemaphore
- **set**: add benchmarks for all 4 functions

## [3.0.4] - 2026-07-21

### 🚀 Features
- **array**: add mapAsync helper
- **array**: add forEachAsync helper
- **array**: add filterAsync helper
- **array**: add resolveConcurrency and runConcurrentMap utilities
- **promise**: add createMutex helper
- **promise**: add createSemaphore helper
- **set**: add native Set methods for union, intersection, difference, and symmetricDifference
- **shared**: add validatePositiveCount helper

### 🐛 Bug Fixes
- **promise**: treat Infinity as no cap in parallelSettle()
- **promise**: treat Infinity as no cap in parallel()
- update npm downloads badge to reflect array package
- update TypeScript references and typecheck script in configuration files

### 📝 Documentation
- update TODO

### 📌 Dependencies
- **deps**: bump the actions group with 2 updates
- **deps**: bump actions/setup-node from 6.4.0 to 7.0.0

## [3.0.3] - 2026-07-20

### 🚀 Features
- **array**: add percentile helper
- **array**: add median helper
- **array**: add meanBy helper
- **array**: add sumBy helper
- **array**: add toByAccessorFn utility
- **guard**: add isLength helper
- **guard**: add isJSONValue helper
- **guard**: add isJSONObject helper
- **guard**: add isJSONArray helper
- **guard**: add isJSON helper
- **guard**: add isNode helper
- **guard**: add isBrowser helper
- **map**: clarify map alternatives
- **map**: add toMapByKey helper
- **map**: add reduce helper
- **map**: add some helper
- **map**: add mapValues helper
- **map**: add mapKeys helper
- **map**: add hasValue helper
- **map**: add findValue helper
- **map**: add findKey helper
- **map**: add filter helper
- **map**: add every helper
- **map**: add countBy helper
- **map**: add new category
- **object**: add titleCaseKeys helper
- **object**: add snakeCaseKeys helper
- **object**: add pascalCaseKeys helper
- **object**: add kebabCaseKeys helper
- **object**: add camelCaseKeys helper
- **object**: add mapDeep helper
- **object**: add sortKeys helper
- **object**: add walkPropertyPath utility
- **set**: add toMapByKey helper
- **set**: add map helper
- **set**: add filter helper
- **set**: add countBy helper
- **set**: add new set category
- **string**: enhance kebabCase helper [**BREAKING**]
- **string**: enhance CamelCase helper [**BREAKING**]
- add new methods and examples for Map and Set

### 🔧 Miscellaneous
- **deps-dev**: bump the dev-dependencies group with 4 updates

### 📝 Documentation
- update TODO
- add prioritized competitive gap analysis to TODO

## [3.0.2] - 2026-07-19

### 🚀 Features
- **promise**: add parallelSettle function for concurrency-limited execution with outcome partitioning
- **release**: add changelog generation during release

### 🐛 Bug Fixes
- **release**: exclude scripts/ from the 100%-coverage gate
- **release**: strip npm's leading -- separator before forwarding args to git-cliff
- check off Signed-Releases in TODO (forgot to flip the box)

### 📝 Documentation
- add DeepWiki badge to README
- update and fix score OpenSSF in TODO
- refresh TODO (v3 shipped, llms.txt landed, drop stale items)

### ✅ Tests
- **release**: add regression tests for the publish pipeline
- **release**: add regression tests for version-manager.ts
- **release**: add regression test for the changelog CLI arg bug

## [3.0.1] - 2026-07-18

### 🚀 Features
- **ci**: add percentageToTier helper
- **string**: add formatProgressBar function and related tests/examples
- **version**: add incrementPrerelease function

## [3.0.0] - 2026-07-18

### 🚀 Features
- **array**: add replaceOrAppend function with examples and tests for upserting items in an array
- **array**: add toggle function with examples and tests for toggling items in an array
- **array**: add symmetricDifference function with examples and tests for array difference
- **clone**: add shallow clone function with tests and examples for various data types
- **color**: refactor color conversion functions to improve precision and reusability with shared regex for hex color formats
- **date**: add parseDuration function with examples and tests for parsing duration strings into milliseconds
- **docs**: update CONTRIBUTING.md with DevContainer setup and add "PRs welcome" badge to README
- **function**: add unary function with examples and tests for single argument restriction
- **guard**: add isWeakMap function with examples and tests for checking WeakMap instances
- **guard**: add isWeakSet function with examples and tests for checking WeakSet instances
- **guard**: add isSet helper with examples and tests for Set instance validation
- **object**: add unflatten function with examples and tests for rebuilding nested objects from dot-notation keys
- **object**: add pickBy function with examples and tests for filtering object entries
- **object**: add omitBy function with examples and tests for filtering object entries
- **object**: add flatten function with examples and tests for nested object flattening
- **object**: add unset function with examples and tests for object key removal
- **object**: implement parsePropertyPath for dot/bracket-notation path parsing with caching and edge-case handling
- **string**: add removeDiacritics function with examples and tests for stripping diacritical marks
- **string**: add dedent function with examples and tests for stripping leading whitespace from multi-line strings
- **string**: add unescapeHtml function with examples and tests for HTML entity unescaping
- **string**: add escapeRegExp function with examples and tests for regex metacharacter escaping
- **todos**: update OpenSSF Scorecard snapshot and improve documentation for token permissions and branch protection
- **update**: add update function with examples and tests for object property updates
- add /add-helper Claude Code skill for scaffolding new helpers
- update TODO.md for v3 release readiness and enhance AI-friendly documentation

### 📝 Documentation
- record the v3 alpha tag fix and recovered-but-unmerged fix commits
- resolve orphaned-tags item — retag after the v3 merge/rebase
- expand JSR investigation to all 18 categories — cross-category imports break per-package publishing
- mark good-first-issue bench-file gap as done (did it myself)
- add discoverability TODOs (site llms.txt, awesome-lists, plugin listing)
- clarify  means an existing helpers/ dir, not free-form
- mark add-helper skill done, detail consumer-facing skill idea
- defer good-first-issue creation until there's visibility
- record JSR publishing investigation and concrete recipe
- note existing per-package llms.txt generation
- record current mutation score (92.5%), downgrade priority
- flag Temporal/Safari browser-compat gap found during audit
- mark AI-friendly TODO items done
- document the BREAKING CHANGE footer requirement for git-cliff
- fix stale cross-package-import claim in AGENTS.md
- add llms.txt and fill in missing README packages
- update TODO with CHANGELOG audit results and orphaned v3 tags finding
- add v3 migration guide [**BREAKING**]
- confirm no @deprecated tags remain before v3

### ✅ Tests
- **array**: add missing benchmark files
- **color**: add missing benchmark files
- **date**: add missing benchmark files
- **function**: add missing benchmark files
- **markdown**: add missing benchmark file
- **number**: add missing benchmark files
- **object**: add missing benchmark files
- **string**: add missing benchmark files
- **version**: add missing benchmark files

## [3.0.0-alpha.2] - 2026-07-17

### 🚀 Features
- **array**: add createSortByBooleanFn utility and corresponding tests/examples
- **array**: add combineSortFns utility and corresponding tests/examples
- **color**: add color manipulation functions with examples and notes for lighten/darken, withAlpha, and isLight/isDark
- **color**: add hslToRgb function with examples and tests for HSL to RGB conversion
- **color**: add rgbToHex function with examples and tests for RGB to hex conversion
- **color**: add rgbToHsl function with examples and tests for RGB to HSL conversion
- **color**: add hexToRgb function with examples and tests for hex color parsing
- **color**: add argbToRgb function and corresponding examples/tests
- **color**: add color utility with conversion and validation functions
- **date**: add test for duck-typed epochMilliseconds = NaN and simplify isEpochMillisecondsLike function
- **guard**: add isCssColor function with tests and examples for color validation
- **helper**: refactor category handling by introducing listHelperCategories utility function
- **object**: introduce KeysOf type for improved null handling in DeepGet
- **type**: refactor OmitByValue and PickByValue to utilize KeysOfType for improved type handling
- **type**: enhance type utilities with improved handling of optional properties and nullability
- filter out categories starting with '_' in helper source file checks

### 🐛 Bug Fixes
- **type**: update UnionToIntersection type to use 'unknown' instead of 'any' for better type safety

### 🔧 Miscellaneous
- upgrade minimum Node.js version to 26 across workflows and documentation

### ♻️ Refactoring
- **date**: replace epochMilliseconds with Temporal.Instant in ensureDate

## [3.0.0-alpha.1] - 2026-07-17

### 🚀 Features
- **promise**: add settle function and corresponding examples and tests
- **release**: add attestation generation for release assets
- **release**: attest and attach SLSA provenance for release assets
- **scorecard**: add SCORECARD_TOKEN to workflow and update TODO for manual setup
- **security**: add SECURITY.md for vulnerability reporting and policy
- **type**: promote compile-time utility types as public API

### 🐛 Bug Fixes
- **CI-CD**: fix malformed scopes.json and add missing scopes
- **CI-CD**: scope post-release contents:write to the mutation job only
- **coherency**: skip _-prefixed dirs in category coherency checks
- **object**: guard compact() and pick() against proto pollution
- **object**: mirror DeepSet fix and test set() new-key inference
- **scorecard**: wire SCORECARD_TOKEN into scorecard.yml on main
- **type**: fix DeepSet empty-path and new-key type resolution

### 🔧 Miscellaneous
- **CI-CD**: bump version to 3.0.0-alpha.0
- **CI-CD**: remove conventional commits configuration and migrate scopes
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group with 6 updates
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group across 1 directory with 6 updates

### ♻️ Refactoring
- **date**: remove deprecated daysDifference
- **date**: remove deprecated safeDate and dateToISOString
- **guard**: rename helpers/type → helpers/guard
- **object**: remove deprecated deepMerge
- **object**: remove deprecated deepClone
- **promise**: fix unsound as T casts in OrThrow helpers
- **shared**: extract _unsafeKeys into helpers/_shared/
- **type**: remove deprecated isEmpty

### 📝 Documentation
- **agents**: align helper placement rule with guard/type split
- **date**: clarify unrounded fractional days in difference()
- fix stale @helpers4/type row, add @helpers4/guard row

### 👷 CI/CD
- **CI-CD**: allow prerelease release types from any branch

### 📌 Dependencies
- **deps**: bump github/codeql-action/upload-sarif in the actions group
- **deps**: bump the actions group with 2 updates

## [2.1.0] - 2026-06-23

### 🚀 Features
- **array**: add UNSAFE_KEYS set for prototype-pollution guard

### 🔧 Miscellaneous
- **deps-dev**: bump the dev-dependencies group across 1 directory with 5 updates
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump @types/node from 25.9.3 to 26.0.0
- **object**: update visibility of internal documentation tags

### ♻️ Refactoring
- **array**: update sort example to use non-mutating toSorted
- **array**: change array parameters to readonly type
- **object**: handle null and undefined in object functions
- **object**: replace deepMerge and deepClone by mergeDeep and cloneDeep
- **string**: handle null and undefined in string helpers

### 📝 Documentation
- **array**: update isEmpty examples for clarity and type safety - rename example title and description for better understanding - ensure type narrowing in guard function for empty arrays

### ✅ Tests
- **array**: add benchmarks for intersects function
- add tests for narrowing null and undefined types

### 📌 Dependencies
- **deps**: bump actions/checkout from 6.0.3 to 7.0.0

## [2.0.4] - 2026-06-21

### 🚀 Features
- **CI-CD**: add content scanning and comment range utilities
- **function**: add error handling and retry logic for wrapped function
- **function**: add maxSize option and update cache key handling
- **number**: add benchmarks for correctFloat function
- **object**: add support for merging symbol keys in deepMerge
- **type**: add notes for DeepPartial and DeepWritable types

### 🐛 Bug Fixes
- **array**: filter NaN dates in sortBy spec and fix bench precision literal

### 🔧 Miscellaneous
- **CI-CD**: update @typescript/native-preview to 7.0.0-dev.20260620.1
- **array**: move mean and sum to array

### ♻️ Refactoring
- **coherency**: simplify test execution with promise handling

### 📝 Documentation
- **CI-CD**: update @since rules for exports

### ✅ Tests
- **function**: cover first.done branch in memoize with maxSize:0
- **number**: add tests for leading-dot decimals

### 📦 Build
- **deps**: update pnpm-lock.yaml for @typescript/native-preview 7.0.0-dev.20260620.1

### 👷 CI/CD
- **CI-CD**: update tag retrieval command for releases

## [2.0.3] - 2026-06-16

### 🚀 Features
- **CI-C CD**: add runtimes field for consumer compatibility
- **CI-CD**: read type definitions from source files for accuracy
- **number**: add isPositiveNumber function with tests
- **type**: add isInfinite example and notes to native alternatives

### 🐛 Bug Fixes
- **CI-CD**: improve comments for built-in module check
- **ci**: fix lint and build failures
- **review**: address code review findings
- **security**: override markdown-it to >=14.2.0

### 🔧 Miscellaneous
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group with 3 updates
- remove isNonEmptyArray and isNonEmptyString implementations and tests

### 📝 Documentation
- **type**: update links to use date/isValid

## [2.0.2] - 2026-06-13

### 🚀 Features
- **array**: add max() that avoids call-stack overflow on large arrays
- **array**: add min() that avoids call-stack overflow on large arrays
- **array**: add natural sort helpers with lazy Intl.Collator init
- **array**: add multi-key createSortByStringFn/NumberFn/DateFn, extract from sort.ts
- **number**: add correctFloat() to eliminate floating-point drift
- **type**: add DeepWritable to strip readonly recursively
- **type**: add DeepPartial with tuple, array, and opaque-type support

### 🐛 Bug Fixes
- **ci**: auto-detect latest release tag in post-release workflow
- **ci**: add tag input to post-release workflow_dispatch
- **ci**: address post-release review findings
- **security**: force esbuild >=0.28.1 via pnpm override (GHSA-gv7w-rqvm-qjhr)

### 🔧 Miscellaneous
- **CI-CD**: remove devcontainer configuration file
- **deps-dev**: bump the dev-dependencies group across 1 directory with 7 updates
- **deps-dev**: bump @typescript/native-preview
- update badge styles and add coverage link

### 📌 Dependencies
- **deps**: bump github/codeql-action in the actions group
- **deps**: bump codecov/codecov-action from 5.5.4 to 7.0.0

## [2.0.1] - 2026-06-03

### 🚀 Features
- **CI-CD**: add peerDependencies from config.json

### 🐛 Bug Fixes
- **deps**: update rxjs to peerDependencies and add to devDependencies
- **node**: resolve config peer dep versions from root package.json
- **type**: improve isEmpty predicate and fix peer dep versioning

### 🔧 Miscellaneous
- **CI-CD**: update commit message guidelines and scopes
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group with 2 updates
- **deps-dev**: bump @typescript/native-preview
- update license link in contributing guidelines
- format commit message generation instructions
- update Node.js version and documentation link

### 📌 Dependencies
- **deps**: bump the actions group with 2 updates
- **deps**: bump github/codeql-action in the actions group

## [2.0.0] - 2026-05-21

### 🐛 Bug Fixes
- **deps**: add pnpm overrides for brace-expansion and ws security vulnerabilities

### 🔧 Miscellaneous
- **deps-dev**: bump the dev-dependencies group across 1 directory with 8 updates
- **deps-dev**: bump @typescript/native-preview

### 📌 Dependencies
- **deps**: bump the actions group with 2 updates

## [2.0.0-beta.3] - 2026-05-16

### 🚀 Features
- **CI-CD**: add source structure validation and integrate into tests
- **array**: add without function and related examples/tests
- **array**: add countBy function with examples and tests
- **array**: add intersects helper and related tests/examples
- **ci**: add CI/CD workflow status utilities configuration
- **function**: add pipe function and examples with tests
- **function**: add compose function and related examples and tests
- **id**: add uuid7 generation and related tests/examples
- **markdown**: add cell option to escape function for table safety
- **markdown**: add markdown utilities configuration
- **number**: add mean function and related examples/tests
- **object**: add deep and shallow equality checks for objects
- **promise**: add resolveRecord function and related examples/tests
- **string**: add words function with examples and tests
- **string**: add escapeHtml function with examples and tests
- **string**: add options to capitalize function for casing control

### 🐛 Bug Fixes
- **CI-CD**: make mutation job non-blocking
- **CI-CD**: fix build and test failures
- **CI-CD**: resolve all 33 typecheck errors in PR

### 🔧 Miscellaneous
- **CI-CD**: update fast-uri to version 3.1.2
- **CI-CD**: add 'deps' to conventional commits scopes
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group with 5 updates
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump oxlint in the dev-dependencies group
- **function**: add missing example files, remove leftover coverage folder
- delete stale old-named equality files, clarify since/bench conventions

### ♻️ Refactoring
- **array**: remove deepEquals and equals implementations

### 📝 Documentation
- **CI-CD**: add initial TODO list for helpers4/typescript
- document intentional cross-category duplicates, fix stale math references

### ✅ Tests
- **url**: refine property test for withoutLeadingSlash function

### 📌 Dependencies
- **deps**: bump github/codeql-action in the actions group
- **deps**: bump github/codeql-action in the actions group

## [2.0.0-beta.0] - 2026-04-30

### 🔧 Miscellaneous
- **CI-CD**: remove commit message generation instructions
- **CI-CD**: remove psi-header configuration and templates

### 📝 Documentation
- **CI-CD**: update gitmoji table with detailed types and usage
- **CI-CD**: update commit message table with detailed types and emojis
- **CI-CD**: update commit message generation instructions

### 👷 CI/CD
- **CI-CD**: add write permission for triggering website docs update

## [2.0.0-alpha.24] - 2026-04-29

### 🔧 Miscellaneous
- **CI-CD**: remove push trigger from scorecard workflow
- **CI-CD**: remove summary steps from lint, security, and typecheck jobs

## [2.0.0-alpha.23] - 2026-04-27

### 🔧 Miscellaneous
- **CI-CD**: add summary step for lint, security, and typecheck jobs
- **CI-CD**: update mutation testing configuration and scripts

## [2.0.0-alpha.22] - 2026-04-27

### 🚀 Features
- **object**: enhance safeJsonParse to handle undefined fallback
- **object**: add safeJsonParse helper with tests and examples
- **string**: add injectWordBreaks function with tests and examples
- **string**: enhance truncate to handle null and undefined inputs
- **string**: add truncate helper with examples and tests

### 🐛 Bug Fixes
- **CI-CD**: correct optional chaining for return type

### 🔧 Miscellaneous
- **CI-CD**: remove write permission for website docs trigger
- **CI-CD**: add GH_REPO environment variable for mutation report upload
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group with 5 updates

### ✅ Tests
- **url**: fix cleanPath property-based test for leading slash inputs

## [2.0.0-alpha.21] - 2026-04-26

### 🚀 Features
- **CI-CD**: update commit scopes
- **CI-CD**: add config for Conventional Commits parsing utilities
- **commit**: add buildConventionalCommitRegex function and tests
- **commit**: add parseConventionalCommit function and tests

### 🔧 Miscellaneous
- **CI-CD**: update commit scopes in generation instructions
- **CI-CD**: update actions to latest SHA
- **CI-CD**: update permissions to read-all in workflow files

### ♻️ Refactoring
- **CI-CD**: update import path for analyzeCommits helper
- **CI-CD**: simplify analyzeCommits using helper function
- **string**: rename errorToReadableMessage into extractErrorMessage

### ✅ Tests
- **commit**: add tests for detecting BREAKING CHANGE in commit body
- **helper**: add CRLF handling for isConventionalCommit

## [2.0.0-alpha.19] - 2026-04-25

### 🚀 Features
- **CI-CD**: add version injection and helper upload for stable releases
- **number**: add formatSize helper with examples and tests
- **type**: enhance processMember to support method signatures
- **workflows**: add trigger for website docs update after release

### 🐛 Bug Fixes
- **CI-CD**: compute new version correctly in dry-run mode
- **build**: handle predicate type serialization in build process
- **string**: constrain titleCase property test to non-whitespace words

### 🔧 Miscellaneous
- **CI-CD**: add postcss override in pnpm configuration

### ♻️ Refactoring
- **helper**: replace array with Set for SKIP_FILENAMES
- **url**: remove gist.github.com from DOMAIN_TO_HOST
- **version**: simplify script execution check

### 👷 CI/CD
- **release**: add continue-on-error for website docs trigger

### 📌 Dependencies
- **deps**: bump ossf/scorecard-action in the actions group
- **deps**: bump github/codeql-action from 3 to 4

## [2.0.0-alpha.18] - 2026-04-20

### 🚀 Features
- **build**: add browser compatibility to engines field
- **workflows**: add mutation score reporting to Stryker dashboard

### 🐛 Bug Fixes
- **build**: robustly derive repoSlug from package.json repository field

### 🔧 Miscellaneous
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group with 5 updates

### 👷 CI/CD
- **release**: add mutation testing summary and json reporter

## [2.0.0-alpha.17] - 2026-04-19

### 🚀 Features
- **config**: add harmony-temporal flag for Node.js 24 compatibility
- **function**: add noop function and related tests
- **function**: add identity function and related tests

## [2.0.0-alpha.16] - 2026-04-19

### 🚀 Features
- **date**: add timestamp conversion and validation helpers

### 🐛 Bug Fixes
- **CI-CD**: fix test timeout and mutation score extraction
- **CI-CD**: skip @helpers4/* internal refs in external dependency scan
- **date**: address PR review comments
- **url**: strip all trailing slashes in withoutTrailingSlash

### 🔧 Miscellaneous
- **docs**: reorganize native alternatives and update references

### ✅ Tests
- **array**: add security edge cases for chunk and unique helpers

### 👷 CI/CD
- add release type and version to dashboard

## [2.0.0-alpha.15] - 2026-04-18

### 🚀 Features
- **date**: update config structure with label and descriptions
- **function**: add optional native alternatives metadata to output

### 🐛 Bug Fixes
- **CI-CD**: correct dry-run command formatting in publish step
- **CI-CD**: correct dry-run command formatting in release workflow

## [2.0.0-alpha.14] - 2026-04-17

### 🚀 Features
- **CI-CD**: add codespace-specific devcontainer without local-mount features
- **CI-CD**: add runtime compatibility checks for Node, Deno, and Bun
- **array**: add toSorted native alternative with examples
- **array**: add ensureArray helper with examples and tests
- **array**: add range helper with examples and tests
- **array**: add partition helper with examples and tests
- **array**: add shuffle helper with examples and tests
- **category**: add llms.txt and additional metadata files to checks
- **promise**: add timeout helper with examples and tests
- **promise**: add tryit function and examples for error handling
- **promise**: add parallel helper with examples and tests
- **promise**: add guard function with examples and tests
- **type**: add various type checking helpers

### 🐛 Bug Fixes
- **array**: correct flattening assertion in ensureArray examples
- **array**: update description for sample function behavior
- **promise**: correct array initialization for results
- **promise**: update isPromise return type to PromiseLike

### 🔧 Miscellaneous
- **CI-CD**: disable local mounts due to Codespace limitations
- **devcontainer**: enable local mounts and pnpm store features
- **string**: update version in pascalCase documentation
- **version**: skip version 2.0.0-alpha.13

### ♻️ Refactoring
- **CI-CD**: update node version references for consistency
- **object**: cast result type for nested property assertion
- **observable**: improve filtering logic in combineLatest function
- **promise**: simplify retry logic and remove unnecessary loop

### 📝 Documentation
- **CI-CD**: add OpenSSF Scorecard badge to README
- add contributing guidelines for helpers4

### ✅ Tests
- **function**: add tests for returnOrThrowError function
- add property-based and contract spec files for all 105 helpers
- add null and undefined handling tests for helpers

### 💄 Style
- **publish**: fix comment casing and format import statement
- reorder imports for consistency across benchmark files

### 👷 CI/CD
- **CI-CD**: add OpenSSF Scorecard workflow
- **CI-CD**: update job-bench workflow to continue on error
- **CI-CD**: update node versions in workflow jobs
- **pr-validation**: remove continue-on-error from jobs
- **release**: format needs array and escape client-payload string

### 📌 Dependencies
- **deps**: bump actions/github-script from 8 to 9

## [2.0.0-alpha.11] - 2026-04-13

### 🚀 Features
- **CI-CD**: add mutation dashboard workflow and report link
- **array**: add compact helper and tests
- **number**: add sum helper and corresponding tests
- **object**: add compact helper and corresponding tests
- **object**: add pick helper and corresponding tests
- **object**: add omit helper and corresponding tests
- **type**: add isNullish helper and tests

### 🔧 Miscellaneous
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump the dev-dependencies group with 8 updates
- **package**: update rxjs version and clean external dependencies

### ♻️ Refactoring
- **function**: remove isDefinedAndNotNull helper function
- **object**: use hasOwnProperty for key checks in pick helper
- **string**: simplify error handling for message property

### 👷 CI/CD
- **CI-CD**: add striker (mutation tests) reporting

## [2.0.0-alpha.10] - 2026-04-12

### 🔧 Miscellaneous
- **.copilot**: remove outdated README.md for context directory
- **array**: remove quickCompare example file
- **array**: remove deepCompare examples and tests, add deepEquals
- **build**: update path for loading native alternatives
- **constants**: move native alternatives to constants directory
- **copilot**: remove README.md from .gitignore
- **metadata**: load native alternatives once and refactor usage
- add coverage and mutation badges to README
- remove LICENSE.md file

### ♻️ Refactoring
- **smoke**: update examples type to readonly array

### 📝 Documentation
- **array**: update examples for quickCompare and improve comments

## [2.0.0-alpha.9] - 2026-04-09

### 🔧 Miscellaneous
- **package**: add homepage field to package.json templates

## [2.0.0-alpha.8] - 2026-04-07

### ♻️ Refactoring
- **function**: use ReflectionKind for member kind mapping

### 📝 Documentation
- **promise**: update function descriptions and remove license comments

## [2.0.0-alpha.7] - 2026-04-07

### 🔧 Miscellaneous
- **deps-dev**: bump @typescript/native-preview
- **deps-dev**: bump typescript from 5.9.3 to 6.0.2
- **deps-dev**: bump @types/node in the dev-dependencies group
- **devcontainer**: update container name to include Typescript
- **lint**: add .oxlintrc.json configuration file

### 📝 Documentation
- **readme**: update documentation links and remove pre-release badge

### ✅ Tests
- enhance tests (lessons from mutations)

### 💄 Style
- reorder import statements for consistency

### 📌 Dependencies
- **deps**: bump actions/create-github-app-token from 2 to 3
- **deps**: bump actions/checkout from 4 to 6

## [2.0.0-alpha.6] - 2026-04-05

### 🚀 Features
- **CI-CD**: Refactor PR comment job to use a separate workflow
- **CI-CD**: Implement conventional commits check in PR validation
- **CI-CD**: Add auto-assign workflow for new issues and pull requests
- **CI-CD**: Split coherency tests into steps and independant scripts
- **CI-CD**: Add new build verification script
- **CI-CD**: Move to Verification workflow
- **CI-CD**: Add git absorb support
- **CI-CD**: Split tests action in atomic actions
- **CI-CD**: Include peer dependencies for 'all' bundle
- **CI-CD**: Add security check on release workflow
- **CI-CD**: Add PR validation workflow
- **date**: add format helpers for date conversion
- **publish**: add provenance option for npm package publishing
- **string**: add slugify helper
- **type**: Add isEmpty  helper
- **version**: add parse helper for SemVer 2.0.0 parsing

### 🐛 Bug Fixes
- **CI-CD**: repair PR validation workflows
- **CI-CD**: Update PR validation message
- **CI-CD**: Update conventional commits validation
- **CI-CD**: Refactor coverage summary retrieval
- **CI-CD**: Correct string interpolation
- **CI-CD**: Update default Node.js version to 24 in workflow files
- **CI-CD**: Update env usage
- **CI-CD**: Correct formatting in PR validation report header
- **CI-CD**: Fix PR auto-comment
- **CI-CD**: Handle doc generation error
- **ci**: Fix workflow by removing pull_request_target trigger
- **coverage**: Add missing bench files to exclusion list
- **devcontainer**: remove invalid feature entry from devcontainer configuration
- **devcontainer**: update devcontainer
- **helper**: enable sourcemap generation for TypeScript compilation
- **tests**: uprove vitest imports
- Improve deepCompare logic and enhance tests for version comparison
- Update coverage thresholds to 100%
- simplify error handling by removing unused error variables in multiple files
- Fix type check

### 🔧 Miscellaneous
- **CI-CD**: fix string interpolation in release script
- **CI-CD**: update build configuration for better performance
- **CI-CD**: Reorder devcontainer features
- **CI-CD**: Add auto-header devcontainer feature
- **CI-CD**: Ignore copilot non-transient files
- **CI-CD**: Add history extension
- **config**: update exclude patterns in coverage configuration
- **config**: add stryker configuration for mutation testing
- **conventionalCommits**: add additional scopes for commits
- **cspell**: remove bunx reference from dictionary
- **dependabot**: add dependabot configuration for dependency updates
- **deps-dev**: bump the dev-dependencies group with 9 updates
- **devcontainer**: add peon-ping feature with packs configuration
- **docs**: remove outdated contribution and issue templates
- **github**: add CODEOWNERS file for default ownership
- **license**: change license from AGPL-3.0 to LGPL-3.0
- **package**: add engines field for Node.js version requirement
- **package**: update package.json for sideEffects property
- add AGPL-3.0 license and editor config
- migrate from npm to pnpm and upgrade to Node.js 24
- migrate from Bun to Node.js + Vitest

### ♻️ Refactoring
- **CI-CD**: Refactor using composite jobs
- **CI-CD**: Clean workflow code
- **CI-CD**: Refactor Workflow into composite actions
- **CI-CD**: Switch to scripts folder (was .ci and .cd)
- **string**: simplify error handling and remove unused interface
- **version**: update compare to use parse helper
- migrate build scripts from Bun to Vite/Rollup

### 📝 Documentation
- **README**: update project overview and package installation details
- update commit message guidelines with gitmoji format
- synchronize with centralized helpers4 guidelines
- Add Copilot instructions with model restrictions
- add AGENTS.md for AI coding agent instructions
- update documentation and scripts from Bun to Node.js/npm

### ✅ Tests
- Add comprehensive tests for version comparison and range satisfaction
- Add missing tests to reach 100% coverage
- Enhance errorToReadableMessage tests with various cases and edge handling

### 👷 CI/CD
- **CI-CD**: Fix Coherency workflow
- **coverage**: add code coverage reporting to PR validation
- **release**: create verified tag and GitHub Release via API
- migrate GitHub Actions and devcontainer from Bun to Node.js

### 📌 Dependencies
- **deps**: bump radashi in the prod-dependencies group
- **deps**: bump peter-evans/repository-dispatch from 2 to 4
- **deps**: bump actions/github-script from 7 to 8
- **deps**: bump actions/setup-node from 4 to 6
- **deps**: bump actions/upload-artifact from 4 to 7
- **deps**: bump actions/download-artifact from 4 to 8

## [2.0.0-alpha.3] - 2025-09-09

### 🚀 Features
- Implement deep and quick comparison utilities for arrays and objects

### 🐛 Bug Fixes
- **CI-CD**: Add Trigganator token
- **release**: Migrate GitHub release creation

### 🔧 Miscellaneous
- **CI-CD**: Rename devcontainer
- release v2.0.0-alpha.3
- Update obsolete devcontainer
- Add copilot helpers

### 👷 CI/CD
- **CI-CD**: Add trigger to the doc

## [2.0.0-alpha.2] - 2025-09-03

### 🐛 Bug Fixes
- **CI-CD**: Update GitHub token with Pushinator
- **CI-CD**: Update GitHub token
- **build**: Update TypeScript compilation and metadata generation logic

### 🔧 Miscellaneous
- release v2.0.0-alpha.2

## [2.0.0-alpha.1] - 2025-08-24

### 🚀 Features
- **CI-CD**: Add GitHub Action release
- **CI-CD**: Enhance  version management
- **CI-CD**: Enhance version and publishing
- **CI-CD**: Add coherency tests for package integrity
- **CI-CD**: Switch shell history to dev-container feature
- **CI-CD**: Improve add-license script
- **CI-CD**: add standardized license
- **CI-CD**: Add peerDependencies in categories' package.json
- **CI-CD**: Configure Bun as the package manager
- **CI-CD**: Enhance zsh history
- **CI-CD**: Enhance devcontainer with  history and credentials
- **CI-CD**: Update devcontainer
- **CI-CD**: Pack and Publish
- **CI-CD**: Add Bun extension to devContainer
- **Observable**: Add combineLatest
- **String**: Add cleanURI
- **String**: Add errorToString
- **Url**: Add relativeURLToAbsolute
- **array**: Add chunk, difference, sort, and unique functions with tests
- **bundle**: add new bundle package
- **date**: Add date utilities with tests for comparison and safe date handling
- **dev**: New dev env
- **function**: Add debounce, memoize and throttle
- **number**: Add clamp, random, and roundTo
- **object**: Add deepClone, deepMerge, get, and set
- **promise**: Add delay and retry
- **string**: Add camelCase and kebabCase
- **tests**: Refactor test to improve readability
- **type**: Add type checking utilities
- **version**: Implement version comparison and increment functions with tests
- **version**: New Version category with stripV helper

### 🐛 Bug Fixes
- **CI-CD**: Remove build directory from release
- **CI-CD**: Simplify version update logic
- **CI-CD**: Avoid console logs in Github Actions
- **CI-CD**: Remove redundant branch input
- **CI-CD**: Enhance version update
- **CI-CD**: Enhance package structure  and type validation
- **CI-CD**: Remove zsh_history from Git tracking
- **CI-CD**: fix self-import of auto-generated index.ts
- **CI-CD**: Fix v1 to v2 version

### 🔧 Miscellaneous
- **CI-CD**: 2025-03 package update
- release v2.0.0-alpha.1
- Delete unused files

### ♻️ Refactoring
- **CI-CD**: Clean legacy shell history management
- **CI-CD**: Improve mounting zsh_history
- **CI-CD**: Refactor to use Bun API
- **CI-CD**: Refactor to use Bun file helpers
- **CI-CD**: New build mechanism
- reset all repository with simpler organisation

### 📝 Documentation
- **CI-CD**: Improve readme files
- Add logo

### 📦 Build
- **CI-CD**: Export side files to every packages

### 👷 CI/CD
- **CI-CD**: New build script
- **monorepo**: Add type definitions build
- **monorepo**: cleanup monorepo
- **monorepo**: speedup preinstall script
- **monorepo**: Rebuild build script from scratch
- **monorepo**: merge common files
- **monorepo**: Import libs from dedicated repos

## [1.9.9] - 2024-02-24
[3.1.2]: https://github.com/helpers4/typescript/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/helpers4/typescript/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/helpers4/typescript/compare/v3.0.9...v3.1.0
[3.0.9]: https://github.com/helpers4/typescript/compare/v3.0.7...v3.0.9
[3.0.7]: https://github.com/helpers4/typescript/compare/v3.0.6...v3.0.7
[3.0.6]: https://github.com/helpers4/typescript/compare/v3.0.5...v3.0.6
[3.0.5]: https://github.com/helpers4/typescript/compare/v3.0.4...v3.0.5
[3.0.4]: https://github.com/helpers4/typescript/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/helpers4/typescript/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/helpers4/typescript/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/helpers4/typescript/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/helpers4/typescript/compare/v3.0.0-alpha.2...v3.0.0
[3.0.0-alpha.2]: https://github.com/helpers4/typescript/compare/v3.0.0-alpha.1...v3.0.0-alpha.2
[3.0.0-alpha.1]: https://github.com/helpers4/typescript/compare/v2.1.0...v3.0.0-alpha.1
[2.1.0]: https://github.com/helpers4/typescript/compare/v2.0.4...v2.1.0
[2.0.4]: https://github.com/helpers4/typescript/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/helpers4/typescript/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/helpers4/typescript/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/helpers4/typescript/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/helpers4/typescript/compare/v2.0.0-beta.3...v2.0.0
[2.0.0-beta.3]: https://github.com/helpers4/typescript/compare/v2.0.0-beta.0...v2.0.0-beta.3
[2.0.0-beta.0]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.24...v2.0.0-beta.0
[2.0.0-alpha.24]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.23...v2.0.0-alpha.24
[2.0.0-alpha.23]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.22...v2.0.0-alpha.23
[2.0.0-alpha.22]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.21...v2.0.0-alpha.22
[2.0.0-alpha.21]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.19...v2.0.0-alpha.21
[2.0.0-alpha.19]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.18...v2.0.0-alpha.19
[2.0.0-alpha.18]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.17...v2.0.0-alpha.18
[2.0.0-alpha.17]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.16...v2.0.0-alpha.17
[2.0.0-alpha.16]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.15...v2.0.0-alpha.16
[2.0.0-alpha.15]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.14...v2.0.0-alpha.15
[2.0.0-alpha.14]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.11...v2.0.0-alpha.14
[2.0.0-alpha.11]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.10...v2.0.0-alpha.11
[2.0.0-alpha.10]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.9...v2.0.0-alpha.10
[2.0.0-alpha.9]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.8...v2.0.0-alpha.9
[2.0.0-alpha.8]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.7...v2.0.0-alpha.8
[2.0.0-alpha.7]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.6...v2.0.0-alpha.7
[2.0.0-alpha.6]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.3...v2.0.0-alpha.6
[2.0.0-alpha.3]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.2...v2.0.0-alpha.3
[2.0.0-alpha.2]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.1...v2.0.0-alpha.2
[2.0.0-alpha.1]: https://github.com/helpers4/typescript/compare/v1.9.9...v2.0.0-alpha.1

