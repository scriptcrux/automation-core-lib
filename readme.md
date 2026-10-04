# ScriptCrux Core Library (`core-lib`)

> Enterprise-grade, modular test automation foundation and framework adapters for TypeScript.

`core-lib` is a multi-package monorepo managed with `pnpm workspaces`. It provides reusable core utilities, database connectors, logger infrastructure, and framework adapters for **Playwright** and **Axios**.

---

## 📦 Packages Overview

| Package | Version | Description |
| :--- | :--- | :--- |
| [`@script-crux/core-shared`](./packages/core-shared) | `1.0.0` | Core logging (Winston), environment configuration, retry helpers, and test listeners. |
| [`@script-crux/core-api`](./packages/core-api) | `1.0.0` | Database clients (PostgreSQL, MongoDB), schema validation, and test data management utilities. |
| [`@script-crux/adapter-playwright`](./packages/adapter-playwright) | `1.0.0` | Custom `@Step` decorators, base page abstractions, browser actions, and ReportPortal integration. |
| [`@script-crux/adapter-axios`](./packages/adapter-axios) | `1.0.0` | Resilient HTTP client wrapper with built-in logging, interceptors, and automated retries. |

---

## 🏗️ Monorepo Architecture

```
core-lib/
├── packages/
│   ├── core-shared/           # Shared loggers, configs, utilities
│   ├── core-api/              # DB clients (Postgres, Mongo), schema validators
│   ├── adapter-playwright/    # Playwright fixtures, decorators, ReportPortal reporter
│   └── adapter-axios/         # Axios interceptors, retry clients
├── apps/                      # Internal verification & smoke test playgrounds
│   ├── playwright-e2e-app/    # Internal Playwright integration test suite
│   └── api-playground-app/     # Internal API client test suite
├── pnpm-workspace.yaml        # Workspace configuration
└── package.json               # Monorepo root scripts & dev dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- `pnpm` >= 9.x (`npm install -g pnpm`)

### Installation & Build

```bash
# Install dependencies across all packages
pnpm install

# Build all packages in topological order
pnpm run build
```

---

## 🧪 Development & Testing

Run internal verification suites:
```bash
# Run internal Playwright app tests
pnpm --filter @script-crux/playwright-e2e-app test

# Run internal API playground tests
pnpm --filter @script-crux/api-playground-app test
```

### Code Quality
```bash
# Lint staged files with ESLint & Prettier
pnpm run lint
```

---

## 🚢 Publishing Packages

Packages can be published to the **NPM Registry** or **GitHub Packages**:

```bash
# Bump package versions across the monorepo
pnpm version patch -r

# Publish all packages (scoped under @script-crux)
pnpm -r publish --access public
```

---

## 📄 License
ISC / Proprietary (ScriptCrux Framework Team)
