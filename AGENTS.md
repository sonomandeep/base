# Project Structure

- This is a TypeScript monorepo using pnpm workspaces and Vite+.
- `apps/app/`: web application built with React, TanStack Start,
  TanStack Router, and Tailwind CSS.
- `apps/api/`: API built with Elysia, running on Node.js through
  `@elysia/node`.

# Tooling & Conventions

- Use the Node.js version specified in `.node-version` and the pnpm
  version declared in the root `package.json`.
- Use Vite+ (`vp`) for development, checks, tests, and builds.
- Follow the existing dependency catalog convention: manage shared
  versions in `pnpm-workspace.yaml` and use `catalog:` references
  in package manifests.
- Frontend routes live in `apps/app/src/routes/`.
  Do not manually edit `apps/app/src/routeTree.gen.ts`; it is generated
  by TanStack Router.

# Commands

Run these commands from the repository root:

- `vp run dev`: start both applications in development mode.
- `vp check`: run formatting, linting, and type checks.
- `vp run -r test`: run tests across workspace packages.
- `vp run -r build`: build workspace packages.
- `vp run ready`: run the full verification sequence
  (checks, tests, and builds).

# Git & Pull Requests

- Use Conventional Commits for commit messages and PR titles
  (e.g., `fix: handle missing user`).
- Keep commit and PR titles concise, specific, and immediately
  understandable.
- Follow `.github/pull_request_template.md` when preparing PRs.
