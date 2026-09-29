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
