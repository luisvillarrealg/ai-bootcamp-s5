---
description: "Run UI tests and summarize failures"
agent: test-engineer
tools: ['read', 'execute', 'todo']
---

# Run UI Tests

Run the Playwright UI tests and summarize the results.

## Instructions

1. **REQUIRED first step**: run `npm run test:ui:install --workspace=frontend` (repeat after a container rebuild).
   - On Ubuntu/Linux, `test:ui:install` is mandatory and must perform `playwright install --with-deps chromium` before running tests.
   - `test:ui:install` includes automatic, bounded Ubuntu repo remediation for the common Yarn key issue, plus one retry.
   - Do NOT perform ad-hoc package hunting or broad OS troubleshooting beyond that automated remediation.
   - If the install still fails, stop immediately and report an **environment blocker** with the failing command and the key error lines.
   - Do not continue to run Playwright tests after a failed dependency install.
2. **Ensure the backend and frontend are running** before executing UI tests. If needed, start them from the repo root with `npm start`.
3. **Run the UI tests** with the project command: `npm run test:ui`.
4. **Summarize** pass/fail results (counts and names of failing tests).
5. **For each failure**, provide the likely root cause category and the evidence:
   - Application code
   - Test code
   - Environment

Next command (if all tests pass): `/validate-step {step-number}`
