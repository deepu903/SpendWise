# User Interviews

### Interview 1: M.S. (VP Engineering at Series B B2B SaaS)
- **Direct Quote:** "I honestly have no idea how many ChatGPT Plus licenses we are paying for. Developers just expense it on their corporate Ramp cards."
- **Surprises:** He wasn't aware that GitHub Copilot had an Enterprise tier, nor that Anthropic's Team tier had a 5-seat minimum. He thought they were just paying a flat rate.
- **What changed in design:** Added the ability to manually input the specific "Plan" for each tool, rather than assuming. Added the cross-tool redundancy check because M.S. noted his team uses both Copilot and Windsurf simultaneously.

### Interview 2: A.K. (Fractional CFO for 4 Startups)
- **Direct Quote:** "Founders don't care about $20/mo, but when I show them that $20/mo times 50 employees across 3 redundant tools equals $36,000 a year, they panic."
- **Surprises:** She emphasized that the output needs to be "board-ready." A purely text-based output wouldn't cut it.
- **What changed in design:** Emphasized the "Annual Savings" on the Results dashboard. Chose a very stark, finance-focused UI (dark mode, monospace fonts for numbers) so the report feels like a serious audit rather than a playful consumer app.

### Interview 3: J.R. (Founder/CEO of Seed Stage AI Startup)
- **Direct Quote:** "We are heavily API dependent. I care less about the $20 ChatGPT seats and more about our runaway Anthropic API costs during testing."
- **Surprises:** For early stage startups, API costs dwarf seat licenses. 
- **What changed in design:** Added "API direct" as a specific tier in the dropdowns so founders can input their raw variable spend and get logic checks (e.g., if API spend per person is massive, maybe they should be using a capped Pro subscription for conversational tasks).
