import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './App.css';

const API_URL = '/api/todos';

const requestJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

// React Query hook for fetching todos
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: () => requestJson(API_URL),
  });
};

function App() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const { data: todos = [], isLoading, isError } = useTodos();

  const refreshTodos = () =>
    queryClient.invalidateQueries({ queryKey: ['todos'] });

  // Mutation for adding a new todo
  const addTodoMutation = useMutation({
    mutationFn: (title) =>
      requestJson(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      refreshTodos();
      setNewTodoTitle('');
    },
  });

  // Mutation for toggling todo completion
  const toggleTodoMutation = useMutation({
    mutationFn: (id) => requestJson(`${API_URL}/${id}/toggle`, { method: 'PATCH' }),
    onSuccess: refreshTodos,
  });

  // Mutation for updating a todo title
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, title }) =>
      requestJson(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      refreshTodos();
      setEditingId(null);
    },
  });

  // Mutation for deleting a todo
  const deleteTodoMutation = useMutation({
    mutationFn: (id) => requestJson(`${API_URL}/${id}`, { method: 'DELETE' }),
    onSuccess: refreshTodos,
  });

  const hasMutationError = [
    addTodoMutation,
    toggleTodoMutation,
    updateTodoMutation,
    deleteTodoMutation,
  ].some((mutation) => mutation.isError);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const incompleteCount = todos.length - completedCount;

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodoMutation.mutate(newTodoTitle);
    }
  };

  const handleToggleTodo = (id) => {
    toggleTodoMutation.mutate(id);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editTitle.trim()) {
      updateTodoMutation.mutate({ id: editingId, title: editTitle.trim() });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            TODO App
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Session 5: Agentic Development
          </Typography>
        </Paper>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleAddTodo}
              sx={{ display: 'flex', gap: 2 }}
            >
              <TextField
                fullWidth
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                variant="outlined"
                size="medium"
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: 120 }}
              >
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load todos. Please check your connection and try again.
          </Alert>
        )}

        {hasMutationError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Something went wrong while saving your changes. Please try again.
          </Alert>
        )}

        {!isLoading && !isError && todos.length === 0 && (
          <Typography
            color="text.secondary"
            sx={{ textAlign: 'center', my: 4 }}
          >
            No todos yet. Add one above to get started!
          </Typography>
        )}

        <Card>
          <List sx={{ p: 0 }}>
            {todos.map((todo, index) => (
              <ListItem
                key={todo.id}
                sx={{
                  borderBottom: index < todos.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  inputProps={{ 'aria-label': `Toggle ${todo.title}` }}
                  sx={{ mr: 2 }}
                />
                {editingId === todo.id ? (
                  <Box
                    component="form"
                    onSubmit={handleSaveEdit}
                    sx={{ display: 'flex', flex: 1, gap: 1 }}
                  >
                    <TextField
                      fullWidth
                      autoFocus
                      size="small"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      inputProps={{ 'aria-label': 'Edit todo title' }}
                    />
                    <IconButton
                      type="submit"
                      size="small"
                      color="primary"
                      aria-label="Save"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Cancel"
                      onClick={handleCancelEdit}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography
                      sx={{
                        flex: 1,
                        textDecoration: todo.completed
                          ? 'line-through'
                          : 'none',
                        color: todo.completed
                          ? 'text.secondary'
                          : 'text.primary',
                      }}
                    >
                      {todo.title}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label={`Edit ${todo.title}`}
                        onClick={() => handleStartEdit(todo)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label={`Delete ${todo.title}`}
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Chip label={`${incompleteCount} items left`} color="primary" />
          <Chip label={`${completedCount} completed`} color="success" />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
