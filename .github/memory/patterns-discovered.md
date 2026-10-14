# Patterns Discovered

Accumulated code patterns, learned over time. Check here before implementing; add an entry when a solution recurs. Committed to git.

## Pattern Template

```markdown
### Pattern: <name>

**Context:** When this applies
**Problem:** What goes wrong without the pattern
**Solution:** What to do
**Example:**
(code)
**Related files:** paths
```

## Patterns

### Pattern: Service initialization (empty array vs null)

**Context:** In-memory services that store a collection (e.g., the todo service).

**Problem:** Initializing the collection as `null` (or `undefined`) forces every consumer to null-check. Calling `.map`, `.find`, or `.length` before data exists throws a `TypeError` and yields 500 errors on a fresh server.

**Solution:** Always initialize collections as an empty array, and reset to an empty array rather than `null`. Return `[]` for "no data".

**Example:**

```js
// ❌ Fragile
let todos = null;
const getAll = () => todos.map((t) => ({ ...t })); // TypeError on first call

// ✅ Safe
let todos = [];
const getAll = () => todos.map((t) => ({ ...t })); // returns []
```

**Related files:** backend service and route modules for todos; corresponding Jest tests (see [docs/testing-guidelines.md](../../docs/testing-guidelines.md)).

### Pattern: Toggle by negation (not by assignment)

**Context:** Endpoints that flip a boolean such as `completed`.

**Problem:** Assigning a constant (`todo.completed = true`) only works in one direction, so toggling back to incomplete never happens.

**Solution:** Negate the current value and always look up the item by id first, returning 404 when it is missing.

**Example:**

```js
// ❌ Never toggles back
todo.completed = true;

// ✅ Toggles
todo.completed = !todo.completed;
```

**Related files:** `packages/backend/src/app.js` (PATCH `/api/todos/:id/toggle`).

### Pattern: Lint fixes for dead code and startup logging

**Context:** Backend ESLint (`no-unused-vars` as error, `no-console` as warn).

**Problem:** Leftover debug variables and `console.log` in `src/index.js` fail or pollute lint.

**Solution:** Delete unused variables instead of silencing them; write startup output with `process.stdout.write` (no extra dependency) until a real logger is introduced.

**Example:**

```js
// ❌ no-console
console.log(`Server running on port ${PORT}`);

// ✅
process.stdout.write(`Server running on port ${PORT}\n`);
```

**Related files:** `packages/backend/src/app.js`, `packages/backend/src/index.js`.

### Pattern: React Query + fetch error handling

**Context:** Frontend data fetching/mutations with `@tanstack/react-query`.

**Problem:** `fetch` does not reject on HTTP 4xx/5xx, so React Query never enters its error state and the UI silently shows nothing.

**Solution:** Wrap `fetch` in one helper that throws when `!response.ok`, use it for the query and every mutation, and render an MUI `<Alert severity="error">` from `isError` / `mutation.isError`. Use a relative API URL (`/api/todos`) so the CRA `proxy` works.

**Example:**

```js
const requestJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};
```

**Related files:** `packages/frontend/src/App.js`.

### Pattern: Testing UI with a stateful fetch fake

**Context:** React Testing Library tests for components that refetch after mutations.

**Problem:** Static `fetch` mocks return the same list after a delete/edit, so post-mutation UI cannot be asserted.

**Solution:** Use a small in-memory fake API (`mockApi(initialTodos)`) that handles GET/POST/PUT/PATCH/DELETE; give mocks an `ok` flag so the error path is testable. Give icon buttons and checkboxes `aria-label`s (`Edit <title>`, `Delete <title>`, `Toggle <title>`) and query by role.

**Related files:** `packages/frontend/src/__tests__/App.test.js`.

### Pattern: Playwright against a shared in-memory backend

**Context:** UI tests share one backend process whose store is not reset between tests.

**Solution:** Page Object (`tests/ui/pages/TodoPage.js`), unique titles per test, clean up created todos, never assert absolute counts, and simulate API failure with `page.route(..., route => route.abort())`.

**Related files:** `packages/frontend/tests/ui/todo.spec.js`.
