# Reflection

### 1. The hardest bug you hit and exactly how you debugged it
The hardest bug was dealing with hydration mismatches when implementing the `localStorage` state persistence in the multi-step form. Next.js server-side renders the initial HTML, but `localStorage` is undefined on the server, causing the client to render different initial markup. I debugged this by isolating the `useEffect` hook, checking the browser console for the specific React hydration error warnings, and ensuring that the initial render state matched the server, only updating the state from `localStorage` after the component had mounted on the client.

### 2. A decision you reversed mid-week and why
I initially planned to use the Anthropic API to perform the actual audit logic and generate the recommended actions. Mid-week, I reversed this decision. I realized that using an LLM for exact pricing logic and mathematical calculations is non-deterministic and prone to hallucinations. A finance person needs hard, defensible logic. So, I wrote a pure TypeScript rules engine (`lib/audit-engine.ts`) for the math, and relegated the AI to generating the personalized summary paragraph.

### 3. What you'd build in week 2
In Week 2, I would build the "Credex Consulting" dashboard where enterprise users can log in, view their historical audits, track their actual realized savings over time, and connect directly via OAuth to tools like GitHub or OpenAI to automatically ingest seat counts rather than relying on manual user input.

### 4. How you used AI tools
I used AI tools (like Copilot and Claude) for generating boilerplate code, specifically the verbose UI components (like the custom `Table` and `Accordion` implementations in Tailwind). I didn't trust it with writing the core pricing logic in the audit engine, as it often hallucinates outdated pricing models. One time it was wrong when it generated a Tailwind v3 config that broke with the newer v4 PostCSS implementation; I caught it, debugged the CSS variables, and manually configured `globals.css` with `@theme inline`.

### 5. Self-rating 1–10
- **Discipline: 9** — Adhered strictly to the exact file structures, design constraints, and format requirements requested.
- **Code quality: 8** — Clean, separated concerns (engine logic vs UI), though components could use stricter prop types.
- **Design sense: 9** — Executed a sharp, dark-mode finance aesthetic utilizing the specific colors and typography requested.
- **Problem-solving: 8** — Successfully managed the transition from dynamic AI logic to a strict deterministic TypeScript engine.
- **Entrepreneurial thinking: 9** — Built a clear, high-converting funnel prioritizing lead capture *after* delivering value.
