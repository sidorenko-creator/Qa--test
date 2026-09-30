# QA Playwright Automation

UI and API automation project built with **Playwright + JavaScript (ES Modules)**.
Target apps: [aqa-app.vercel.app](https://aqa-app.vercel.app) (web shop) and
[jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) (REST API).

## Stack

Playwright Test · JavaScript (ESM) · Faker.js · dotenv · GitHub Actions · Page Object Model

## Project structure

```text
.
├── playwright.config.js        Projects, timeouts, retries, workers, reporters, browser environment
├── global-teardown.js          Runs once after all tests: removes the saved auth session
├── pages/                      Page Objects (one class per page)
│   ├── RegisterPage.js  LoginPage.js  CatalogPage.js
│   └── CartPage.js  CheckoutPage.js  MyAccountPage.js
├── fixtures/index.js           Custom `test`: page objects, card data, saved session
├── data/testdata.js            Test data generators (Faker) and API payloads
├── utils/                      paths, session helpers, shared afterEach hook
├── tests/
│   ├── setup/auth.setup.js     SETUP: register → log in → save storageState
│   ├── ui/
│   │   ├── registration.spec.js        register → log in → log out      (starts logged out)
│   │   ├── checkout.spec.js            cart → payment → account         (starts logged in)
│   │   └── browser-environment.spec.js locale, timezone, geolocation, permissions, color scheme
│   └── api/posts.spec.js       GET / POST / PATCH / DELETE /posts
├── playwright/.auth/           storageState + session (generated, git-ignored, removed by teardown)
├── reports/                    json / junit reports (generated, git-ignored)
└── .github/workflows/          CI
```

## Setup

```bash
npm ci
npx playwright install            # all browsers (or: npx playwright install chromium)
```

Copy `.env.example` to `.env` only if you need other environments or run options.

## How a run works

```text
                ┌──────────────┐
                │ setup project│  register user → log in → save playwright/.auth/state.json
                └──────┬───────┘
     depends on        │
 ┌─────────┬───────────┼───────────┬──────────────┬───────────────┐
 chromium  firefox   webkit   mobile-chrome   mobile-safari          api-tests (independent)
 (all start already logged in through storageState)
                               │
                               ▼
                       globalTeardown  → deletes playwright/.auth
```

## Projects

| Project         | What it runs                      | Device / browser          |
| --------------- | --------------------------------- | ------------------------- |
| `setup`         | `tests/setup/*.setup.js`          | Desktop Chrome            |
| `chromium`      | `tests/ui/**` (default UI)        | Desktop Chrome            |
| `firefox`       | `tests/ui/**`                     | Desktop Firefox           |
| `webkit`        | `tests/ui/**`                     | Desktop Safari            |
| `mobile-chrome` | `tests/ui/**`                     | Pixel 7 (emulation)       |
| `mobile-safari` | `tests/ui/**`                     | iPhone 14 (emulation)     |
| `api-tests`     | `tests/api/**`                    | no browser                |

## Run tests

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm test`             | Chromium + API (default, same as CI)                |
| `npm run test:all`     | every project: 3 desktop browsers + 2 mobile + API  |
| `npm run test:e2e`     | UI tests in Chromium                                |
| `npm run test:api`     | API tests                                           |
| `npm run test:smoke`   | only tests tagged `@smoke`                          |
| `npm run test:firefox` / `test:webkit` / `test:mobile` | one browser group |
| `npm run test:headed`  | Chromium with a visible window                      |
| `npm run test:ui`      | Playwright UI mode                                  |
| `npm run test:debug`   | Playwright Inspector                                |
| `npm run test:list`    | list all tests without running them                 |
| `npm run report`       | open the last HTML report                           |

Tags: `@smoke`, `@e2e`, `@checkout`, `@auth`, `@api`, `@env` — use `npx playwright test --grep @auth`.

### Run options (`.env` or environment)

| Variable      | Effect                                                        |
| ------------- | ------------------------------------------------------------- |
| `HEADED=true` | show the browser                                              |
| `SLOW_MO=300` | slow each browser action by 300 ms (handy to watch a test)    |
| `WORKERS=4`   | number of parallel workers (default: CI 2, local = half of CPU cores) |
| `KEEP_AUTH=true` | keep `playwright/.auth` after the run, so you can re-run with `--no-deps` |

## Execution control (playwright.config.js)

| Setting                         | Value                          | Meaning                                   |
| ------------------------------- | ------------------------------ | ----------------------------------------- |
| `timeout`                       | 30 s                           | one test, including hooks                 |
| `expect.timeout`                | 5 s                            | one auto-retrying assertion               |
| `actionTimeout` / `navigationTimeout` | 10 s / 20 s              | one click/fill / one page load            |
| `globalTimeout`                 | 15 min on CI                   | the whole run                             |
| `retries`                       | CI 2, local 0                  | failed tests are retried only on CI       |
| `workers`                       | CI 2, local auto               | parallel processes                        |
| `fullyParallel`                 | true                           | tests in one file also run in parallel    |
| `maxFailures`                   | CI 10                          | stop early if everything is broken        |
| per-block                       | `test.describe.configure({ timeout, retries })` | checkout 60 s, API 15 s + 2 retries |
| per-step                        | `test.step(title, body, { timeout })` | payment step 15 s                  |

## Reporters

`list` (console) · `html` (`playwright-report/`) · `json` (local, `reports/results.json`) ·
`junit` and `github` (CI). Every test shows readable **steps** (`test.step`) with attachments
(selected products, response bodies, registered e-mail, masked card number).
Traces, screenshots and videos are kept on failure.

## Browser environment

Set once in `playwright.config.js` for all UI projects and verified in
`tests/ui/browser-environment.spec.js`: `locale: en-US`, `timezoneId: Europe/Kiev`,
`geolocation` Kyiv, `permissions: ['geolocation']`, `colorScheme: light`, `launchOptions.slowMo`.
Any option can be overridden for a group of tests with `test.use({ ... })`.

## Run tests directly from VS Code

Install the official **Playwright Test for VS Code** extension (`ms-playwright.playwright`),
open the project root (folder with `package.json`) and use the **Testing** sidebar.
Select the `chromium` project (and keep `setup` ticked) — `setup` runs automatically before UI tests.
Keep **Show Browsers** disabled for background runs.

## Course topics covered (lessons 18–25)

| #  | Topic                                   | Where                                                              |
| -- | --------------------------------------- | ------------------------------------------------------------------ |
| 18 | Tests in `test.step` / `TestStepInfo`   | all specs (`step.attach` in checkout, API, setup)                   |
| 19 | `describe`, `beforeEach/All`, `afterEach/All` | `checkout.spec.js`, `registration.spec.js` (beforeEach/afterEach), `posts.spec.js` (beforeAll/afterAll) |
| 20 | Setup project + `dependencies`          | `setup` project, `tests/setup/auth.setup.js`                        |
| 21 | Global teardown, `storageState`, reporters | `global-teardown.js`, `AUTH_STATE_PATH`, `reporter` in config    |
| 22 | Timings and execution control           | `timeout`, `expect.timeout`, `describe.configure`, step `timeout`   |
| 23 | Workers and retries                     | `workers`, `retries`, `fullyParallel`, `maxFailures`                |
| 24 | Desktop and mobile browsers             | `chromium`, `firefox`, `webkit`, `mobile-chrome`, `mobile-safari`   |
| 25 | Browser environment                     | `locale`, `timezoneId`, `geolocation`, `permissions`, `launchOptions` |
