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
