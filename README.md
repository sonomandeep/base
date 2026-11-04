# Vite+ Monorepo Starter

A starter for creating a Vite+ monorepo.

## Development

- Check everything is ready:

```bash
vp run ready
```

- Run the tests (succeeds even when no test files exist yet):

```bash
vp run -r test
```

- Build the monorepo:

```bash
vp run -r build
```

- Start all applications (app on port 5173, API on port 3000):

```bash
vp run dev
```

Application `dev` tasks build their workspace dependencies before starting. Build
results are cached; development servers and package.json scripts are not.

Declare internal dependencies with `workspace:*` in each consumer's package.json.
New packages that need compilation should define a `build` task in their
vite.config.ts with `dependsOn: [{ task: "build", from: ["dependencies", "devDependencies"] }]`
so dependency builds are ordered recursively. Dependencies without a build task
are skipped. Do not duplicate a task name in package.json scripts.

These are initial builds, not library watchers. If a library is consumed from
its dist directory, run its watcher in a separate terminal while editing it.

To start one application and prepare its dependencies:

```bash
vp run app#dev
vp run api#dev
```
