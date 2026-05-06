# Metrics Strategy

**North Star Metric:**
**"Total Aggregate Dollars Saved."**
*Why:* This aligns perfectly with the core value proposition of SpendWise AI. If the tool isn't finding real savings for users, the product has no utility. Tracking aggregate dollars saved acts as a direct proxy for the amount of value we are delivering to the ecosystem, which in turn justifies our consulting fees or premium SaaS tiers.

**3 Input Metrics:**
1. **Audits Completed per Week:** Measures top-of-funnel engagement and whether the 3-step form has too much friction.
2. **Lead Capture Conversion Rate:** Measures how compelling the "save this report" CTA is on the results page. If this is low, the perceived value of the audit is too low.
3. **High-Savings Flag Rate:** The percentage of audits that result in >$500/mo savings. This measures whether we are attracting the right target audience (larger startups with actual bloat vs. solo founders).

**What to Instrument First:**
The drop-off rate between Step 1, Step 2, and Step 3 of the audit form. If users bounce at Step 2 (adding tools), it means they either don't know their stack or the manual entry is too tedious, signaling an immediate need for automated integrations (e.g., Okta/Google Workspace OAuth).

**Pivot Trigger Number:**
If the **Lead Capture Conversion Rate** falls below **3%** after 1,000 completed audits, we pivot. A sub-3% capture rate means that even after receiving personalized savings data, users do not trust us enough or don't value the data enough to give us their email, invalidating the lead-gen economics model.
