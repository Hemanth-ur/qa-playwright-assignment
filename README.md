# QA Engineer Take-Home Assignment

Playwright + TypeScript test suite covering UI automation against [SauceDemo](https://www.saucedemo.com) and API testing against [Reqres](https://reqres.in).

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

---

## Setup

```bash
npm install
npx playwright install chromium
```
## Environment Configuration

The Reqres API now requires an API key for accessing its public endpoints.

1. Create a free API key from:
   https://app.reqres.in/api-keys

2. Copy `.env.example` and rename it to `.env`.

3. Update the API key:

```env
REQRES_API_KEY=your_api_key_here
```

## Running Tests

| Command | What it runs |
|---|---|
| `npm test` | All tests (UI + API) |
| `npm run test:ui` | UI tests only |
| `npm run test:api` | API tests only |
| `npm run test:headed` | UI tests in a visible browser |
| `npm run report` | Open the last HTML report |
### Run API Tests

```bash
npm run test:api
```

> **Note:** A valid Reqres API key is required for the API tests to execute successfully.
---

## Project Structure

```
├── pages/
│   ├── LoginPage.ts       # Login form interactions and assertions
│   ├── ProductsPage.ts    # Product listing, sorting, add-to-cart
│   └── CheckoutPage.ts    # Cart → checkout → confirmation flow
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts      # Login scenarios (standard + locked-out)
│   │   ├── cart.spec.ts       # Cart badge and sort-by-price
│   │   └── checkout.spec.ts   # Full checkout flow
│   └── api/
│       └── users.spec.ts      # Reqres GET, POST, and bonus create-then-verify
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## What Each Part Covers

### Part 1 — UI (SauceDemo)

| Test | Scenario |
|---|---|
| `login.spec.ts` | Standard user logs in → lands on products page |
| `login.spec.ts` | Locked-out user sees error → stays on login page |
| `cart.spec.ts` | Adding two products → cart badge shows 2 |
| `cart.spec.ts` | Sort by price low-to-high → cheapest item is first |
| `checkout.spec.ts` | Full flow: add items → cart → checkout info → finish → confirmation |

### Part 2 — API (Reqres)

| Test | Scenario |
|---|---|
| `users.spec.ts` | GET `/api/users?page=2` → status 200, `data` array, required fields on every user |
| `users.spec.ts` | POST `/api/users` → status 201, echoed `name`/`job`, generated `id` + `createdAt` |
| `users.spec.ts` (bonus) | Create-then-verify flow: POST → assert response contract matches what a follow-up GET would expect |

---

## Design Decisions & Trade-offs

**Page Object Model** — Each page class encapsulates locators and actions behind a typed interface. Tests only call methods, never interact with locators directly. This keeps tests readable and centralises maintenance.

**`data-test` attributes preferred** — SauceDemo exposes `data-test` attributes on most interactive elements. `getByTestId` is the most resilient locator strategy; it's decoupled from visual layout and text.

**`getByRole` / `getByLabel` fallback** — Where `data-test` wasn't available, semantic locators were used. CSS selectors were avoided except for the cart badge where no semantic alternative exists.

**Tests are independent** — Each test navigates from scratch (or logs in via `beforeEach`). No test shares state with another. This allows `--fully-parallel` execution.

**API tests use the `request` fixture** — No browser is launched for API specs. This is faster and tests the HTTP contract directly.

**Bonus create-then-verify** — reqres does not persist POST data, so a follow-up GET would return 404. The bonus test documents this constraint explicitly and demonstrates how the pattern *would* be structured against a real API.

**What I would add with more time:**
- A `fixtures/` layer exposing a logged-in `page` so `beforeEach` login doesn't repeat across files
- Environment-based config (`.env`) for credentials rather than inline strings
- GitHub Actions workflow for CI
- `expect.soft()` for non-critical assertions to avoid early bail-out

---

## Submission Note

Completed all five UI scenarios and all three API scenarios (including bonus). The test suite runs fully in parallel and passes cleanly. The main trade-off was keeping the POM methods focused — I chose not to build shared fixtures within the time-box, opting instead for readable `beforeEach` blocks which any engineer can follow immediately.


## Notes

While working on this assignment, I noticed that Reqres now requires an API key for its public endpoints. The project has been updated to support this change by loading the API key from environment variables, keeping sensitive information out of the source code and making the project easier to configure.
