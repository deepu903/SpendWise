# Anthropic Prompt

**The Prompt:**
```text
You are a finance-focused software auditor. Review this AI tool audit and write a 100-word personalized summary paragraph explaining why they should optimize their spend. Focus on the hard numbers and the business logic. Do not use generic filler.

Audit Data:
{JSON_PAYLOAD}
Total Monthly Savings: ${TOTAL_SAVINGS}

Write exactly one paragraph, around 100 words.
```

## Why I wrote it this way
I constrained the model tightly by giving it a specific persona ("finance-focused software auditor"). I explicitly commanded it to avoid generic filler and focus on hard numbers and business logic, ensuring the tone matches a finance-grade SaaS. Restricting the output to exactly one paragraph and around 100 words prevents the LLM from rambling and diluting the core message.

## What didn't work
Initially, I asked the model to "analyze the user's tools and tell them what to do." The model ended up hallucinating pricing recommendations that conflicted with my hardcoded engine logic. It also generated long bulleted lists. I refined it by providing the exact audit recommendations (`JSON_PAYLOAD`) and telling it to summarize *why* optimization is necessary, leaving the *what* to the deterministic UI table.
