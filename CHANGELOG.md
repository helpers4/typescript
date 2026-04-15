# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### 🚀 Features
- **CI-CD**: add codespace-specific devcontainer without local-mount features
- **CI-CD**: add runtime compatibility checks for Node, Deno, and Bun
- **array**: add shuffle helper with examples and tests
- **promise**: add timeout helper with examples and tests
- **promise**: add tryit function and examples for error handling
- **promise**: add parallel helper with examples and tests
- **promise**: add guard function with examples and tests
- **type**: add various type checking helpers

### 🐛 Bug Fixes
- **array**: update description for sample function behavior
- **promise**: update isPromise return type to PromiseLike

### 🔧 Miscellaneous
- **string**: update version in pascalCase documentation

### ♻️ Refactoring
- **CI-CD**: update node version references for consistency

### ✅ Tests
- add null and undefined handling tests for helpers

### 💄 Style
- reorder imports for consistency across benchmark files

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
[Unreleased]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.11...HEAD
[2.0.0-alpha.11]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.10...v2.0.0-alpha.11
[2.0.0-alpha.10]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.9...v2.0.0-alpha.10
[2.0.0-alpha.9]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.8...v2.0.0-alpha.9
[2.0.0-alpha.8]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.7...v2.0.0-alpha.8
[2.0.0-alpha.7]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.6...v2.0.0-alpha.7
[2.0.0-alpha.6]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.3...v2.0.0-alpha.6
[2.0.0-alpha.3]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.2...v2.0.0-alpha.3
[2.0.0-alpha.2]: https://github.com/helpers4/typescript/compare/v2.0.0-alpha.1...v2.0.0-alpha.2
[2.0.0-alpha.1]: https://github.com/helpers4/typescript/compare/v1.9.9...v2.0.0-alpha.1

