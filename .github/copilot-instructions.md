# Copilot Instructions

## Project Context

- Full-stack TODO application with a React frontend and an Express backend
- Focus on iterative, feedback-driven development
- Current phase: Backend stabilization and frontend feature completion

## Documentation References

Use these docs to navigate the project:

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

- **Test-Driven Development**: Red-Green-Refactor cycle
- **Incremental Changes**: Small, testable modifications
- **Systematic Debugging**: Use test failures as guides
- **Validation Before Commit**: All tests pass, no lint errors

## Testing Scope

This project uses unit tests, integration tests, and UI end-to-end tests:

- Backend: Jest + Supertest for API testing
- Frontend: React Testing Library for component unit/integration tests
- UI testing: Playwright for critical user journey automation
- Manual browser testing for exploratory validation and visual checks
- Reason: Combine fast feedback (unit/integration) with end-to-end quality confidence (UI tests)

**Testing Approach by Context**:

- Backend API changes: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- Frontend component features: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR). Follow with manual browser testing for full UI flows.
- This is true TDD: Test first, then code to pass the test

## Workflow Patterns

1. **TDD Workflow**: Write/fix tests → Run → Fail → Implement → Pass → Refactor
2. **Code Quality Workflow**: Run lint → Categorize issues → Fix systematically → Re-validate
3. **Integration Workflow**: Identify issue → Debug → Test → Fix → Verify end-to-end
4. **UI Testing Workflow**: Define critical journeys → Create UI tests → Run → Debug failures → Validate coverage

## Agent Usage

- **tdd-developer**: Implementation and TDD cycles (unit, integration, and critical-path Playwright UI tests). Always writes tests first for new features; when fixing failing tests, does not fix lint issues.
- **code-reviewer**: Addressing lint errors and code quality improvements.
- **test-engineer**: Deeper Playwright UI test authoring/execution, failure triage, and isolation checks.

## Memory System

- **Persistent Memory**: This file (`.github/copilot-instructions.md`) contains foundational principles and workflows
- **Working Memory**: `.github/memory/` directory contains discoveries and patterns (see [.github/memory/README.md](memory/README.md))
- During active development, take notes in `.github/memory/scratch/working-notes.md` (not committed)
- At end of session, summarize key findings into `.github/memory/session-notes.md` (committed)
- Document recurring code patterns in `.github/memory/patterns-discovered.md` (committed)
- Reference these files when providing context-aware suggestions

## Workflow Utilities

GitHub CLI commands for workflow automation (available to all modes):

- List open issues: `gh issue list --state open`
- Get issue details: `gh issue view <issue-number>`
- Get issue with comments: `gh issue view <issue-number> --comments`

Notes:

- The main exercise issue will have "Exercise:" in the title
- Steps are posted as comments on the main issue
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked

## Git Workflow

- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Feature branches: `feature/<descriptive-name>`
- Always stage all changes before committing: `git add .`
- Push to the correct branch: `git push origin <branch-name>`
