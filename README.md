# base

> Work in progress.

This project is under active development. Documentation will follow as it takes shape.

## Releases

[Release Please](https://github.com/googleapis/release-please) manages independent
versions for the web app and API through a single, aggregated release pull request.
The workspace root is not released. Connector and internal packages will be added
when they exist.

| Component | Version file            | Changelog               | Tag format   |
| --------- | ----------------------- | ----------------------- | ------------ |
| Web app   | `apps/app/package.json` | `apps/app/CHANGELOG.md` | `app-v0.0.1` |
| API       | `apps/api/package.json` | `apps/api/CHANGELOG.md` | `api-v0.0.1` |

Each component's first release is `0.0.1`. Commits up to and including the
`bootstrap-sha` in `release-please-config.json` are excluded from the initial
changelogs. The empty `.release-please-manifest.json` does not mark any version as
already released; Release Please updates it when release PRs are merged.

### Pull requests

Use [Conventional Commit](https://www.conventionalcommits.org/) messages and PR
titles without scopes. The PR title check rejects scopes. For example:

```text
feat: add workspace selector
fix: handle expired sessions
chore: update development tooling
feat!: change authentication response
```

Release Please assigns changes to components by modified file paths, not by scope. A PR that changes both app and API can affect
both versions with the same commit type. Changes only to root tooling do not
automatically release either component.

Squash-merge PRs using the PR title as the commit title and the PR description as
the commit body. Describe breaking changes in the PR body when applicable:

```text
BREAKING CHANGE: the old authentication response is no longer supported.
```

After the initial `0.0.1` release, version increments follow these rules:

- `fix`: patch, for example `0.0.1` → `0.0.2`.
- `feat`: minor, for example `0.0.1` → `0.1.0`.
- Breaking changes (`!` or a `BREAKING CHANGE` footer): minor before `1.0.0`,
  major afterward.
- Routine maintenance such as `chore`, `ci`, and `docs` without breaking changes
  does not normally initiate a release.

### Release workflow

1. Squash-merge a releasable change into `main`.
2. Release Please opens or updates a release PR containing the affected versions
   and changelogs. The first releasable change for each component proposes `0.0.1`;
   installing the automation alone does not require an immediate release.
3. Review and squash-merge the release PR when ready. All components included in
   that PR are released together, but their versions remain independent.
4. The workflow creates a separate tag and GitHub Release for each released
   component.

Release Please generates the component changelogs in its release PRs. It does not
publish packages, build distribution artifacts, or deploy applications.

### GitHub setup

Before the release workflow can run:

1. Create a GitHub App with these repository permissions: **Contents: read and
   write**, **Issues: read and write**, and **Pull requests: read and write**.
   Install it only on this repository; no deployment or administration permissions
   are needed.
2. Add the repository Actions variable `RELEASE_PLEASE_APP_CLIENT_ID` with the
   app's **Client ID** (not its numeric App ID), and the Actions secret
   `RELEASE_PLEASE_APP_PRIVATE_KEY` with the generated PEM private key.
3. Enable squash merging and disable merge commits and rebase merging. Set the
   default squash commit message to **Pull request title and description**.
4. Require pull requests for `main` and add **Validate PR title** as a required
   status check once the workflow has run. The title workflow uses
   `pull_request_target` without checking out PR code, so it also supports forks;
   it first becomes active after being merged into `main`.

The GitHub App token is scoped to this repository and lets release PRs trigger
other workflows. Using the built-in `GITHUB_TOKEN` for Release Please would
normally prevent those follow-up workflow runs. No App secrets are exposed to
the PR title workflow.

To retry the release automation, manually run **Release Please** on `main` from
the Actions tab. Repository settings, App credentials, and branch protection must
be configured on GitHub; the workflow files do not change them.
