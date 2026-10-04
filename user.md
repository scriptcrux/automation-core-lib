# EPAM Systems – Lead SDET (JS/TS Profile) Interview Preparation Guide

This repository contains a curated, high-density technical question bank tailored specifically for the **Lead SDET (JavaScript/TypeScript)** interview loop at EPAM Systems. The questions focus on core language internals, framework architecture, and enterprise-level CI/CD integrations.

---

## 📋 Table of Contents
1. [JavaScript / TypeScript Core Internals & Async Mechanics](#1-javascript--typescript-core-internals--async-mechanics)
2. [Node.js Framework Engineering (Playwright / Cypress)](#2-nodejs-framework-engineering-playwright--cypress)
3. [Integration, API, & CI/CD Pipeline Control](#3-integration-api--cicd-pipeline-control)
4. [How to Use This Guide](#how-to-use-this-guide)

---

## 1. JavaScript / TypeScript Core Internals & Async Mechanics

### 🛠️ Question 1.1: Event Loop Execution Sequencing
Predict the exact console output of the following code snippet. Explain how the Node.js / V8 engine manages tasks using the **Call Stack**, **Microtask Queue**, and **Macrotask Queue**.
```typescript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
process.nextTick(() => console.log('D'));
setTimeout(() => console.log('E'), 1);
console.log('F');
```

### 🛑 Question 1.2: Event Loop Blockage & Thread Starvation
What happens to automation test execution if a custom utility performs a massive synchronous operation (e.g., `fs.readFileSync` on a large file inside a loop)? How do you prevent thread starvation in Node.js applications?

### 🏗️ Question 1.3: Advanced TypeScript Utility Types
Given a base database interface `UserAccount`, how do you programmatically create a type for a test data fixture that makes all fields optional except for `userId` and `email`? Demonstrate using `Pick`, `Omit`, or `Partial`.

### 💾 Question 1.4: Object Mutation and Deep Copying
Explain the structural difference between shallow copying (via spread operator `{ ...obj }`) and deep copying an execution configuration object in Node.js. What are the performance and memory implications of using `structuredClone()` versus `JSON.parse(JSON.stringify())`?

### 🛡️ Question 1.5: Global Asynchronous Error Catching
If an automation script triggers an unhandled asynchronous error inside an unawaited database connection promise, how do you catch it at the framework level (`process.on('unhandledRejection')`) to prevent the entire runner process from crashing abruptly?

---

## 2. Node.js Framework Engineering (Playwright / Cypress)

### 🌐 Question 2.1: Browser Isolation Architecture (Playwright)
Explain the structural and memory differences between a **Browser**, a **Browser Context**, and a **Page** in Playwright. How do you exploit Contexts to execute parallel tests using distinct user sessions (e.g., User, Admin) simultaneously?

### 🔄 Question 2.2: Native CDP Connection vs. Proxy Interception (Cypress)
Contrast Cypress’s internal proxy architecture (running inside the browser's execution loop) against Playwright’s utilization of the Chrome DevTools Protocol (CDP) via WebSockets. What are the practical trade-offs regarding cross-domain navigation and multi-tab automation?

### 🔌 Question 2.3: Custom Test Fixtures Strategy
How do you build custom dependency-injection fixtures in Playwright (`test.extend<MyFixtures>`) to completely replace repetitive, flake-prone `beforeEach` hooks for authentication and database instantiation?

### ⚖️ Question 2.4: Flakiness Engineering & Actionability
Explain the difference between Playwright’s built-in **Auto-Waiting / Actionability Checks** and explicit waiting conditions (`page.waitForURL()`, `locator.waitFor()`). How do you architect code to ensure test suites do not rely on static sleep (`page.waitForTimeout()`)?

### 🌲 Question 2.5: Complex Shadow DOM and Iframe Interruption
How does your chosen framework natively traverse deeply nested Shadow DOM roots and cross-origin `iframes`? Write a brief pseudo-locator showing how to click an element buried inside an iframe.

---

## 3. Integration, API, & CI/CD Pipeline Control

### 🧵 Question 3.1: Parallel Worker Multi-Threading & Race Conditions
If you configure your JS framework config file to run with `workers: 4`, how do you handle data collisions or race conditions when multiple tests attempt to modify or mutate the same shared testing backend database?

### 📜 Question 3.2: Contract Validation at the API Layer
How do you automate programmatic contract and schema validation inside a Node.js framework? Explain how to integrate libraries like `Ajv` (JSON Schema Validator) or `Zod` to fail tests immediately if an API response body shape drifts from the specification.

### 🔌 Question 3.3: Network Mocking and Service Interception
Detail how you intercept network traffic dynamically (`route.fulfill()` in Playwright or `cy.intercept()` in Cypress) to simulate edge cases like network timeouts, `500 Internal Server Errors`, or empty boundary conditions without touching actual downstream microservices.

### 🐳 Question 3.4: Dockerized Pipeline Optimization
Explain the complete configuration steps for running headless Playwright or Cypress suites inside a Linux-based Docker container on a CI platform (e.g., Azure DevOps, GitLab CI, or Jenkins). How do you cache `node_modules` and system browser binaries effectively to optimize execution time?

### 🚧 Question 3.5: Git-Hooks & Code Gatekeeping
How do you implement and configure automated gatekeeping utilizing `Husky`, `lint-staged`, `ESLint`, and `Prettier` to strictly prevent developers or QA automation engineers from committing code that contains debugging blocks or unformatted syntax?

---

## How to Use This Guide

1. **Clone this workspace** or save this file as `README.md` in your study directory.
2. Use these topics as mock interview points. Focus on answering with **architectural reasoning** rather than just syntax solutions.
3. For live practice, code out your responses to **Question 1.1** (Event Loop) and **Question 2.3** (Fixtures) as they are the highest-frequency questions in EPAM panel rounds.


# EPAM Lead SDET (L4) Interview Preparation Guide

This guide contains core technical, architectural, and leadership interview questions designed for the internal transition from L3 to Lead SDET (L4) at EPAM.

---

## 🏗️ Framework Architecture & Design

### Question 1: Cross-Platform Framework Design
> *If you are asked to build a test automation framework from scratch for a project with web, mobile, and API components, what tech stack would you choose and why? How will you ensure maximum code reuse across these platforms?*

#### Ideal L4 Answer Strategy:
*   **The Approach:** Focus on a unified language stack (e.g., TypeScript or Java) to reduce context switching for the team. 
*   **Tech Stack Selection:** Propose a modern tool set like **Playwright** for Web and API, and **Appium** for Mobile. Explain that Playwright offers fast, parallel execution with low flakiness, while Appium allows shared logic for mobile.
*   **Code Reuse:** Explain how to use a **Layered Architecture**. Keep business logic and test data separate from UI locators. Use design patterns like the **Screenplay Pattern** or **Component-Driven POM** so that API and UI tests can share the same test data templates and validation helpers.

### Question 2: Test Data Management (TDM)
> *How do you handle Test Data Management in a large-scale automation framework where multiple teams run tests at the same time? How do you prevent tests from modifying or locking data that other tests need?*

#### Ideal L4 Answer Strategy:
*   **The Approach:** Avoid hardcoded or shared static data. Move toward dynamic data creation.
*   **Solutions:**
    *   **Just-in-Time (JIT) Data:** Use API hooks inside the `Before` steps to create fresh data right before the test runs, and use `After` hooks to clean it up.
    *   **Data Isolation:** If using a shared database, implement a data-vending service or routing system that flags records as "in use" so concurrent tests do not pick up the same record.
    *   **Mocking:** Use service virtualization for third-party data to avoid hitting rate limits or causing state conflicts.

### Question 3: Handling Flaky Tests
> *What is your strategy for handling flaky tests in a CI/CD pipeline? If a critical deployment is blocked by a flaky test, what immediate and long-term actions do you take?*

#### Ideal L4 Answer Strategy:
*   **Immediate Action:** Implement a **Test Quarantine** process. Move the flaky test out of the critical deployment pipeline immediately so it stops blocking the release. Never just increase sleep times.
*   **Long-Term Action:** 
    *   Analyze execution logs and network traces to find the root cause (usually race conditions, dynamic elements, or bad data cleanup).
    *   Rewrite the test to use explicit, smart waits instead of hardcoded timers.
    *   Set up a pipeline metric that automatically alerts the team if a test fails and passes on the retry, flag it for review before it goes back to the main suite.

---

## 🚀 CI/CD & DevOps Integration

### Question 4: Optimizing the Feedback Loop
> *Imagine your automated regression suite takes 3 hours to run. The development team wants to deploy code 5 times a day. How would you restructure the pipeline and framework to give them fast feedback without losing test coverage?*

#### Ideal L4 Answer Strategy:
*   **The Approach:** Break down the giant execution block into a **Tiered Testing Strategy**.
*   **Pipeline Redesign:**
    *   **Tier 1 (Smoke Test):** Run a small 5-10 minute suite on every single pull request.
    *   **Tier 2 (Impact-Based Testing):** Use code-coverage mapping tools to run only the tests related to the modified code modules.
    *   **Tier 3 (Parallel Scheduled Regression):** Run the full 3-hour regression suite in parallel across containerized environments (like Selenium Grid or Playwright on Kubernetes sharding) during off-peak times or once every hour, reducing the time from 3 hours to under 15 minutes.

### Question 5: DevSecOps & Quality Gates
> *How do you integrate security scanning (DevSecOps) and performance checks into a standard automation pipeline? At what stages should these run?*

#### Ideal L4 Answer Strategy:
*   **Security Integration:** Run **Static Application Security Testing (SAST)** tools during the code compilation phase. Run **Dynamic Application Security Testing (DAST)** tools right after deploying to a QA environment.
*   **Performance Integration:** Embed lightweight API performance tests (using tools like **k6** or **JMeter**) into the regression pipeline to catch API latency regressions early. Run deep, heavy load testing on a schedule in a dedicated performance environment.
*   **Quality Gates:** Set strict thresholds in tools like **SonarQube** (e.g., zero blocker bugs, minimum 80% unit test coverage) that will automatically break the build if quality drops.

---

## 👥 Leadership, Strategy & Client Management

### Question 6: Managing Release Risks with Clients
> *As an L4 Lead, how do you handle a situation where a client or Product Owner demands a release to go live, but your quality metrics show high risk and critical open bugs?*

#### Ideal L4 Answer Strategy:
*   **The Approach:** Do not just say "No." Instead, speak the language of risk and business impact.
*   **Action Plan:** Present a clear **Risk Map** showing exactly which business features will fail if the bugs trigger in production. Suggest alternative options:
    *   **Feature Flagging:** Turn off the buggy features in production so the rest of the stable app can still ship.
    *   **Phased Rollout:** Release to only 5% of users (Canary deployment) to monitor the real-world impact safely.
    *   **Informed Sign-off:** If they still insist, document the known risks clearly so the stakeholders can make an educated business decision.

### Question 7: Measuring Automation ROI
> *How do you define and track the ROI (Return on Investment) of automation for your team? What metrics do you show to higher management to prove your automation strategy is working?*

#### Ideal L4 Answer Strategy:
*   **The Approach:** Management cares about time, cost, and product safety—not just the number of test scripts written.
*   **Key Metrics to Track:**
    *   **Time Saved:** (Manual execution time - Automated execution time) x Number of runs.
    *   **Defect Leakage Rate:** The percentage of bugs that slipped past QA into production (this should go down over time).
    *   **Defect Detection Efficiency (DDE):** How early in the pipeline bugs are caught by automation.
    *   **Release Velocity:** How much faster the team can ship code now compared to when testing was manual.

### Question 8: Overcoming Team Resistance
> *Describe a time when you had to deal with resistance from developers who did not want to write unit tests or help with automation. How did you change their minds and improve collaboration?*

#### Ideal L4 Answer Strategy:
*   **The Approach:** Build a bridge of empathy and show them how automation actually saves *their* time.
*   **Action Plan:** 
    *   Organize a workshop to show that writing unit tests prevents bugs from bouncing back to them days later, which stops them from context switching.
    *   Make it easy for them by setting up test boilerplates, snippets, and easy local run commands.
    *   Involve developers in choosing the test frameworks so they feel ownership over the code quality. Pair-program with them on complex test scenarios.

---

## 💡 Quick Tips for Passing the L4 Interview
1.  **Shift from "Doing" to "Guiding":** Use words like *design, architect, mentor, optimize, and align*. Avoid sounding like an engineer who only takes tasks from a ticket.
2.  **Focus on Scale:** Always assume the application has millions of users and hundreds of developers. Your answers must show that your strategies will scale up smoothly.
3.  **Tie to EPAM Delivery:** Frame your answers around standard Agile delivery frameworks, showcasing how you keep high quality while meeting tight sprint timelines.



# Distributed Test Reporting Guide

This document outlines the technical architecture and configuration steps for aggregating test reports when executing end-to-end (E2E) suites in parallel across sharded containers, Docker grids, or matrix CI pipelines.

## ⚠️ The Problem Statement

When running tests concurrently across separate computing instances or containers:
1. Each instance runs in absolute isolation and generates its own local report files.
2. When a container completes its execution, it destroys itself, erasing all local files.
3. If reports are simply uploaded as-is, they overwrite each other or exist as fragmented, unreadable files.

To fix this, we implement a **Split-Gather-Merge** pipeline architecture.

---

## 🏗️ Architectural Strategies

We support three main design patterns depending on the capabilities of the testing framework:

| Pattern | How it Works | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Native Blob Merging** | Containers emit binary/blob fragments; a final CI job compiles them natively. | Zero external dependencies, ultra-fast. | Only supported by modern tools (Playwright). |
| **Artifact Stitching** | Containers output standard XML/JSON; CI collects files; standard CLI tools stitch them. | Highly flexible, works with any tool (Cypress, WDIO). | Requires custom scripts and file-management steps in CI. |
| **Live API Streaming** | Framework listeners POST real-time results via HTTP to a central server. | Real-time monitoring, no file management needed. | Requires maintaining a dedicated server instance. |

---

## 🛠️ Framework Implementations

### 1. Playwright (TypeScript)
Playwright provides native support for sharded container reports using the **Blob Reporter**.

#### Configuration (`playwright.config.ts`)
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Configure the blob reporter to create unique chunk files per worker/shard
  reporter: [['blob', { outputDir: 'blob-report' }]],
});
```

#### The CI Pipeline Strategy
1. **Test Job Matrix:** Run shards in parallel. Each container generates a unique file in `./blob-report/`.
2. **Upload:** Use your CI's upload utility to send `./blob-report/` to a shared artifact workspace.
3. **Merge Job:** Trigger a downstream job that runs the following native command:
```bash
# Downloads all blobs to a local directory, then compiles them into a clean HTML dashboard
npx playwright merge-reports --reporter=html ./all-downloaded-blobs
```

---

### 2. Cypress
Cypress operates on a single machine instance. To run it across parallel containers, use `mochawesome` to output raw JSON chunks and merge them post-execution.

#### Configuration (`cypress.config.ts`)
```typescript
import { defineConfig } from "cypress";

export default defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,  // Prevent parallel files from wiping each other out
    html: false,       // Turn off HTML compilation inside the individual container
    json: true,        // Force output to a raw JSON data fragment
  },
  e2e: {
    setupNodeEvents(on, config) { /* ... */ },
  },
});
```

#### The CI Pipeline Strategy
1. **Test Job Matrix:** Execute Cypress specs distributed across containers. Collect all `cypress/results/*.json` files.
2. **Upload:** Send all JSON fragments to your CI artifact storage space.
3. **Merge Job:** Create a single node-based container job to download the fragments and execute:
```bash
# 1. Combine all loose JSON structures into a unified master database file
npx mochawesome-merge ./all-downloaded-jsons/*.json > master-report.json

# 2. Feed the master database to the generator to construct a static visual HTML dashboard
npx marge master-report.json --reportDir ./final-html-report
```

---

### 3. WebdriverIO (WDIO)
WebdriverIO supports cross-container sharding by generating decoupled xUnit/JUnit XML files.

#### Configuration (`wdio.conf.ts`)
```typescript
export const config = {
    // ... basic project configs
    reporters: [
        'spec',
        ['junit', {
            outputDir: './junit-results',
            // Append the unique internal Container ID (cid) to ensure file names never collide
            outputFileFormat: function(options) { 
                return `results-${options.cid}.xml`
            }
        }]
    ]
}
```

#### The CI Pipeline Strategy
1. **Test Job Matrix:** Spin up containers. Each container saves unique XML strings to `./junit-results/`.
2. **Upload:** Ship all individual XML files up to your pipeline's runner storage.
3. **Merge Job:** Trigger an independent cleanup job that aggregates the files using the `junit-report-merger` (jrm) engine:
```bash
# Combines every loose JUnit XML file into a single structured master test suite document
npx junit-report-merger ./final-report.xml "./all-xml-results/*.xml"
```

---

## 🌐 Alternative: Real-Time Centralized Dashboards

To completely bypass file moving, artifact uploading, and manual merging script configurations, plug a **Real-Time Reporter Dashboard** into your framework config.




# Function Point Analysis (FPA)

Function Point Analysis (FPA) is a standardized software engineering technique used to measure the structural size of a software system. Instead of counting lines of code, FPA measures size based on the specific functionality the software delivers to its users.

This method allows project managers to estimate project timelines, required development effort (man-hours), and costs independently of the programming language or technology stack used.

---

## 📋 The 5 Key Functional Parameters

FPA evaluates a software system from a user's perspective across five distinct functional dimensions:

1. **External Inputs (EI)**
   * Data or control information entering the system from the outside.
   * *Examples:* Login credentials, user registration forms, settings submissions.

2. **External Outputs (EO)**
   * Data leaving the system to the user or an external process, typically involving derived or processed logic.
   * *Examples:* Generated reports, automated email invoices, analytics charts.

3. **External Inquiries (EQ)**
   * On-demand inputs that trigger immediate data retrieval without altering or updating the system's internal state.
   * *Examples:* Searching for a product, checking an order status history.

4. **Internal Logical Files (ILF)**
   * Major logical groupings of data maintained entirely *within* the system boundary.
   * *Examples:* A database table for user profiles, a local system configurations file.

5. **External Interface Files (EIF)**
   * Data referenced by the system but maintained and controlled by a *different* application or external service.
   * *Examples:* Pulling weather information via a third-party API, authenticating via Google OAuth.

---

## 🧮 Calculation Methodology

Calculating the final Function Points (FP) requires a three-step process combining raw functional counts with overall system complexity.

### Step 1: Calculate Unadjusted Function Points (UFP)
Each of the 5 parameters is classified as **Simple**, **Average**, or **Complex** based on its data element types and record element types. Standard weights are assigned to each category, multiplied by the occurrences, and summed:

$$\text{UFP} = \sum (\text{Count of Elements} \times \text{Complexity Weight})$$

### Step 2: Determine Value Adjustment Factor (VAF)
The overall system environment is evaluated across 14 General System Characteristics (GSC)—such as data communications, transaction rates, and performance requirements. Each factor is rated on a scale from `0` (no influence) to `5` (strong influence).

The VAF is calculated using the following formula:

$$\text{VAF} = 0.65 + \left(0.01 \times \sum_{i=1}^{14} \text{Rating}_i\right)$$

### Step 3: Compute Final Function Points
Multiply the raw functional size by the environmental adjustment factor to get the final score:

$$\text{FP} = \text{UFP} \times \text{VAF}$$

---

## 🚀 Benefits of FPA

* **Objective Sizing:** Measures what the software actually *does* rather than the volume of code written, enabling direct comparison between different languages.
* **Accurate Estimation:** Provides historical baselines to predict the required development effort (person-months) and overall costs earlier in the lifecycle.
* **Scope Control:** Simplifies tracking feature creep by explicitly mapping changes, additions, or deletions back to user functions.





linting and husky
pnpm version patch -r


tomorrow:
https://github.com/reportportal/agent-js-playwright

https://github.com/reportportal/examples-js/blob/main/.github/workflows/CI-sharded.yml




1. three point estimation
2. delhi technique or planning poker
3. WBS
4. Function Point 


i have interview today at lead sdet for internal assessment in EPAM in JS/TS, so preparing for that



