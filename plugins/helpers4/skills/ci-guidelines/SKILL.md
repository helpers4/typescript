---
name: ci-guidelines
description: Audit or build a GitHub Actions CI against the helpers4 guidelines — entry points and reusable jobs, one required check, least-privilege permissions, SHA-pinned actions, concurrency, security checks, guarded releases, readable failures — and propose the fixes, workflow by workflow
---

Review the CI of the current repository (or write a new one) against the helpers4 CI guidelines.
Report first, edit only after the user agrees.

## 0. Before anything

- Read the guide, the source of truth: https://helpers4.dev/guides/ci/ . The checklist below is a
  summary and may lag behind it.
- List the workflows: `.github/workflows/*.yml` and the local actions under `.github/actions/`. Read
  every file before judging; do not guess from the names.
- Note the ecosystem (pnpm, npm, cargo, ...): the guide is written from a pnpm/cargo point of view,
  so translate the commands rather than copying them.
- helpers4 publishes reusable actions (https://helpers4.dev/action/): `setup-pnpm`,
  `conventional-commits` and others. Prefer them to re-writing the same step.

## 1. Audit

Check each point and record **where** it fails (`file:line`), not just that it does.

| Point | What good looks like | How to check |
| --- | --- | --- |
| Structure | A few entry points (PR, `main`, release, schedule) composing reusable `job-*` workflows (`workflow_call`) | One giant workflow, or the same steps copied across files |
| One required check | A single aggregator job (`if: always()`, `needs: [...]`) that fails on any `failure` or `cancelled` result, and is the only required check in the ruleset | `grep -n "contains(needs" .github/workflows/*.yml`; no aggregator means every job is a required check |
| Permissions | `permissions: contents: read` at the top of every workflow, widened per job only | A workflow with no top-level `permissions:` block gets the repo default, often write |
| Pinned actions | Third-party actions pinned to a full 40-character commit SHA, with Dependabot keeping them current | `grep -nE "uses: [^@]+@(v?[0-9]\|main\|master)" .github/workflows/*.yml` |
| Concurrency | `concurrency` with `cancel-in-progress: true` on PR workflows, keyed on the PR number | No `concurrency:` block on `pull_request` workflows |
| Skipped work | `paths-ignore` for files that cannot change the result (docs, licence) | Docs-only PRs running the full suite |
| Secrets | OIDC instead of long-lived tokens where the registry supports it; a GitHub App token when a workflow must push and trigger others | `secrets.` used for npm, cloud or PyPI publishing |
| Security checks | Dependency audit, dependency review on PRs, a scheduled OpenSSF Scorecard, [zizmor](https://github.com/zizmorcore/zizmor) on the workflows | Missing jobs |
| Commit messages | Validated against Conventional Commits if the changelog is generated from them | No check |
| Releases | Manual `workflow_dispatch`, a repo guard, a `dry-run` input, resumable, provenance attached | Release on `push` of a tag with no guard, no dry run |
| Readable results | Specific job and step names, `::error::` annotations that say how to fix, one PR comment updated in place, results in `$GITHUB_STEP_SUMMARY` | Failures only visible in raw logs |

Also check the injection basics: no `${{ github.event.* }}` interpolated directly into a `run:`
script (pass it through `env:` instead), and `pull_request_target` never checking out the PR head.

## 2. Report before editing

Give a table, most valuable first:

| Where (`file:line`) | Problem | Fix | Effort | Risk |
| --- | --- | --- | --- | --- |

Say plainly what is already good, and when there is nothing to change. Do not pad the list with
points the repository does not need (a library with no releases does not need a release guard).
Order by security first, then speed, then style.

## 3. Apply, after the user agrees

- One concern per change, so each is easy to review and revert.
- Pin an action by resolving its tag to the full SHA with `gh api repos/<owner>/<repo>/git/ref/tags/<tag>`
  (dereference annotated tags), and keep the tag in a trailing comment: `# v4.2.0`.
- Adding the aggregator job: list every job it must cover, then tell the user to switch the
  branch ruleset to require only that job. This cannot be done from a workflow file.
- Validate every edited workflow with `actionlint` if it is installed, and run
  [zizmor](https://github.com/zizmorcore/zizmor) if available. Do not claim a workflow works
  without running it or saying it was not run.
- Do not change what a job tests, only how it is wired, unless the user asks.

## 4. Do not

- Copy a helpers4 workflow verbatim: the repository's ecosystem, runners and secrets differ.
- Loosen a permission or a pin to make a failing run pass.
- Edit the branch ruleset or repository settings: describe the change and let the user make it.
- Commit unless asked to this turn.
