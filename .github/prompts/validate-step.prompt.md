---
description: "Validate that all success criteria for the current step are met"
agent: code-reviewer
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Step

Verify that all success criteria for the given step are met in the current workspace.

Step number (REQUIRED): ${input:step-number:Step number (for example, 5-0 or 5-1)}

The step number is required. If it was not provided, ask for it before continuing.

## Instructions

1. **Find the exercise issue** with the gh CLI (see **Workflow Utilities** in [copilot-instructions.md](../copilot-instructions.md)); its title contains "Exercise:".
2. **Get the issue with comments**.
3. **Find the step**: search the issue and comments for the heading `# Step {step-number}:`.
4. **Extract the "Success Criteria" section** from that step.
5. **Check each criterion** against the current workspace state (inspect files, run tests/lint, or run commands as the criterion requires). Track each criterion as a todo item.
6. **Report completion status**:
   - ✅ / ❌ for each criterion, with the evidence checked
   - For each incomplete item, give specific guidance on what is missing and how to fix it
   - An overall verdict: step complete or not

Do not modify files; this prompt only validates and reports.
