# ScriptCrux Core Library (`core-lib`)

> Enterprise-grade, modular test automation foundation and framework adapters for TypeScript.

`core-lib` is a multi-package monorepo managed with `pnpm workspaces`. It provides reusable core utilities, database connectors, logger infrastructure, distributed telemetry, network mocking, and framework adapters for **Playwright** and **Axios**.

---

## 📦 Packages Overview

| Package | Version | Description |
| :--- | :--- | :--- |
| [`@script-crux/core-shared`](./packages/core-shared) | `1.0.0` | Central logger, schema-driven environment validator (`EnvValidator`), entity lifecycle manager (`DisposableEntityManager`), and crypto helpers. |
| [`@script-crux/adapter-axios`](./packages/adapter-axios) | `1.0.0` | Resilient HTTP client wrapper with distributed tracing (`X-Correlation-Id`), latency SLA profiling, runtime contract validation, and retries. |
| [`@script-crux/adapter-playwright`](./packages/adapter-playwright) | `1.0.0` | Page object abstractions (`BasePage`), `@Step` decorators, soft assertion engine (`SoftAssert`), network fault mocking (`NetworkMocking`), and SSE stream helpers. |
| [`@script-crux/core-api`](./packages/core-api) | `1.0.0` | Database clients (PostgreSQL, MongoDB), schema validation, and test data management utilities. |

---

## 🌟 Key Architectural Capabilities

### 1. Distributed Tracing & Latency SLA Profiling (`adapter-axios`)
- **Correlation ID Tracking**: Automatically injects `X-Correlation-Id` and `X-Request-Id` headers into all outbound requests.
- **Latency SLA Profiler**: Automatically benchmarks request duration (in milliseconds), flags SLA threshold breaches, and exposes telemetry via `client.getLastTelemetry()`.
- **Runtime Schema Validation**: Enforces API contract schemas via `getAndValidate<T>()` and `postAndValidate<T>()` throwing typed `ContractValidationError`.

### 2. UI Network Fault Simulation & Soft Assertions (`adapter-playwright`)
- **Microservice Fault Injection**: Seamlessly simulate microservice outages (`mockServiceFailure('**/api/invoices*', 500)`) and restore endpoints via `clearNetworkMocks()`.
- **Soft Assertions Engine**: Execute multi-element UI verifications using `SoftAssert` (`assertTrue`, `assertEqual`, `assertContains`, `assertAll`) without halting execution on the first failure.
- **Real-Time Event Stream Helper**: Deterministically listen for and assert browser Server-Sent Events (SSE) via `EventStreamHelper.waitForClientEvent()`.

### 3. Schema-Driven Env Validation & Entity Lifecycle (`core-shared`)
- **Strict Environment Validation**: Parse and type-coerce environment configs with `EnvValidator.validateAndParse<T>()` and `ConfigManager.getValidatedConfig<T>()`.
- **Disposable Entity Manager**: Manage test resource cleanup using `DisposableEntityManager` with automatic LIFO teardown.

---

## 🏗️ Monorepo Architecture

```
core-lib/
├── packages/
│   ├── core-shared/           # Loggers, EnvValidator, DisposableEntityManager, ConfigManager
│   ├── core-api/              # DB clients (Postgres, Mongo), schema validators
│   ├── adapter-playwright/    # BasePage, BaseApi, SoftAssert, NetworkMocking, EventStreamHelper
│   └── adapter-axios/         # BaseAxiosClient, TelemetryInterceptor, RetryInterceptor
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

## 🧪 Development & Verification

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

## 📄 License
ISC / Proprietary (ScriptCrux Framework Team)
