import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderApp = () =>
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <App />
    </QueryClientProvider>
  );

const jsonResponse = (body, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });

// Stateful fake of the todos API so refetches after mutations reflect changes
const mockApi = (initialTodos = []) => {
  let todos = initialTodos.map((todo) => ({ ...todo }));

  global.fetch = jest.fn((url, options = {}) => {
    const method = options.method || 'GET';
    const match = String(url).match(/\/api\/todos(?:\/(\d+))?(\/toggle)?$/);
    const id = match && match[1] ? Number(match[1]) : null;

    if (method === 'GET') return jsonResponse(todos);

    if (method === 'POST') {
      const todo = {
        id: todos.length + 100,
        completed: false,
        ...JSON.parse(options.body),
      };
      todos.push(todo);
      return jsonResponse(todo, 201);
    }

    if (method === 'PUT') {
      const todo = todos.find((t) => t.id === id);
      Object.assign(todo, JSON.parse(options.body));
      return jsonResponse(todo);
    }

    if (method === 'PATCH') {
      const todo = todos.find((t) => t.id === id);
      todo.completed = !todo.completed;
      return jsonResponse(todo);
    }

    if (method === 'DELETE') {
      todos = todos.filter((t) => t.id !== id);
      return jsonResponse({});
    }

    return jsonResponse({}, 404);
  });
};

const sampleTodos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Walk dog', completed: true },
  { id: 3, title: 'Read book', completed: false },
];

afterEach(() => {
  jest.clearAllMocks();
});

test('renders TODO App heading', async () => {
  mockApi();
  renderApp();

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

describe('API configuration', () => {
  test('fetches todos from a relative URL', async () => {
    mockApi();
    renderApp();

    await screen.findByText(/no todos yet/i);
    expect(global.fetch.mock.calls[0][0]).toBe('/api/todos');
  });
});

describe('empty state', () => {
  test('shows a message when there are no todos', async () => {
    mockApi([]);
    renderApp();

    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
  });

  test('does not show the empty message when todos exist', async () => {
    mockApi(sampleTodos);
    renderApp();

    await screen.findByText('Buy milk');
    expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
  });
});

describe('stats', () => {
  test('calculates items left and completed from todos', async () => {
    mockApi(sampleTodos);
    renderApp();

    expect(await screen.findByText('2 items left')).toBeInTheDocument();
    expect(screen.getByText('1 completed')).toBeInTheDocument();
  });

  test('updates stats after toggling a todo', async () => {
    const user = userEvent.setup();
    mockApi(sampleTodos);
    renderApp();

    await screen.findByText('2 items left');
    await user.click(screen.getByRole('checkbox', { name: /toggle buy milk/i }));

    expect(await screen.findByText('1 items left')).toBeInTheDocument();
    expect(screen.getByText('2 completed')).toBeInTheDocument();
  });
});

describe('delete', () => {
  test('sends a DELETE request and removes the todo', async () => {
    const user = userEvent.setup();
    mockApi(sampleTodos);
    renderApp();

    await screen.findByText('Buy milk');
    await user.click(screen.getByRole('button', { name: /delete buy milk/i }));

    expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'DELETE',
    });
    await screen.findByText('1 completed');
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  });

  test('shows the empty state after deleting the last todo', async () => {
    const user = userEvent.setup();
    mockApi([{ id: 1, title: 'Only one', completed: false }]);
    renderApp();

    await screen.findByText('Only one');
    await user.click(screen.getByRole('button', { name: /delete only one/i }));

    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
  });
});

describe('edit', () => {
  test('saves an edited title with a PUT request', async () => {
    const user = userEvent.setup();
    mockApi(sampleTodos);
    renderApp();

    await screen.findByText('Buy milk');
    await user.click(screen.getByRole('button', { name: /edit buy milk/i }));

    const input = screen.getByRole('textbox', { name: /edit todo title/i });
    expect(input).toHaveValue('Buy milk');
    await user.clear(input);
    await user.type(input, 'Buy oat milk');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Buy oat milk' }),
    });
    expect(await screen.findByText('Buy oat milk')).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: /edit todo title/i })
    ).not.toBeInTheDocument();
  });

  test('cancel discards the edit without calling the API', async () => {
    const user = userEvent.setup();
    mockApi(sampleTodos);
    renderApp();

    await screen.findByText('Buy milk');
    await user.click(screen.getByRole('button', { name: /edit buy milk/i }));
    await user.type(
      screen.getByRole('textbox', { name: /edit todo title/i }),
      ' extra'
    );
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalledWith(
      '/api/todos/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  test('does not save an empty title', async () => {
    const user = userEvent.setup();
    mockApi(sampleTodos);
    renderApp();

    await screen.findByText('Buy milk');
    await user.click(screen.getByRole('button', { name: /edit buy milk/i }));
    await user.clear(screen.getByRole('textbox', { name: /edit todo title/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(global.fetch).not.toHaveBeenCalledWith(
      '/api/todos/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

describe('add', () => {
  test('creates a todo and clears the input', async () => {
    const user = userEvent.setup();
    mockApi([]);
    renderApp();

    await screen.findByText(/no todos yet/i);
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Write tests');
    await user.click(screen.getByRole('button', { name: /^add$/i }));

    expect(await screen.findByText('Write tests')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });
});

describe('error handling', () => {
  test('shows an error message when loading todos fails', async () => {
    global.fetch = jest.fn(() => jsonResponse({ error: 'boom' }, 500));
    renderApp();

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText(/failed to load todos/i)).toBeInTheDocument();
  });

  test('shows an error message when the network request fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network down')));
    renderApp();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /failed to load todos/i
    );
  });

  test('shows an error message when a mutation fails', async () => {
    const user = userEvent.setup();
    mockApi(sampleTodos);
    const happyFetch = global.fetch;
    global.fetch = jest.fn((url, options = {}) =>
      options.method === 'DELETE'
        ? jsonResponse({ error: 'nope' }, 500)
        : happyFetch(url, options)
    );
    renderApp();

    await screen.findByText('Buy milk');
    await user.click(screen.getByRole('button', { name: /delete buy milk/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /something went wrong/i
    );
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });
});
