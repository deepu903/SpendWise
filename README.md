# SpendWise AI

SpendWise AI is a full-stack SaaS application that helps startups audit their AI tool spend and surface actionable savings instantly. By analyzing current tool plans (like GitHub Copilot, Claude, ChatGPT, etc.) against team size and use case, it provides finance-defensible recommendations to optimize overhead.

## Quick Start

1. Clone the repository
2. Run `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:3000`

## Screenshots

*(Mocked)*
1. `docs/hero-screenshot.png`
2. `docs/audit-form.png`
3. `docs/results-dashboard.png`

## Trade-off Decisions
1. **Mocked Supabase initially**: Used local state/sessionStorage for the form to avoid complex setup during local evaluation.
2. **Next.js App Router**: Chosen for built-in API routes and simple full-stack capabilities despite learning curve.
3. **Manual UI Components**: Wrote simplified Radix-style UI components directly with Tailwind to minimize dependency bloat.
4. **Hardcoded Engine**: The audit rules engine relies on hardcoded pricing data rather than a dynamic API to ensure reliability and strict compliance with known finance models.
5. **SessionStorage for Results**: Passed data via sessionStorage instead of a database roundtrip to keep the basic flow completely stateless and extremely fast.

## Deployed URL
https://spendwise-ai-demo.vercel.app
