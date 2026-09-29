# QA Playwright Automation

UI and API automation project built with Playwright and JavaScript.

## Stack

- Playwright Test
- JavaScript (ES Modules)
- Faker.js
- GitHub Actions
- Page Object Model

## Project structure

```text
pages/          Page Object classes
fixtures/       Custom Playwright fixtures
utils/          Reusable helpers
data/           Test data
tests/ui/       UI/E2E tests
tests/api/      API tests
.github/        CI configuration
```

## Setup

```bash
npm ci
npx playwright install
```

Copy `.env.example` to `.env` if custom environments are required.

## Run tests

```bash
npm test
npm run test:e2e
npm run test:api
npm run test:headed
npm run test:ui
npm run report
```

## Run tests directly from VS Code

Install the official **Playwright Test for VS Code** extension (`ms-playwright.playwright`).

Then open the project root — the folder containing `package.json` and `playwright.config.js`.
Open the Testing icon in the left sidebar. You can run an individual test or an entire file with the green Run button.

The Chromium project is configured with `headless: true`, so tests run in the background by default. In the Playwright sidebar keep **Show Browsers** disabled for background execution. Enable it only when you need to watch or debug a test.

Useful commands:
- `npm test` — all tests
- `npm run test:e2e` — UI tests
- `npm run test:api` — API tests
- `npm run test:headed` — UI tests with a visible browser
- `npm run report` — open the last HTML report
