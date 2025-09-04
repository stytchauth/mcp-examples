import { Router } from 'express';
import {authorizeSessionMiddleware, authorizeTokenMiddleware} from './auth.js';
import { TodoService } from './TodoService.js';

const router = Router();

// All routes use authorization middleware
router.use(authorizeSessionMiddleware());

// Get all todos
router.get('/todos', async (req, res) => {
  try {
    const todoService = new TodoService(req.user!.user_id);
    const todos = await todoService.get();
    res.json({ todos });
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ error: 'Failed to get todos' });
  }
});

// Create a new todo
router.post('/todos', async (req, res) => {
  try {
    const { todoText } = req.body as { todoText: string };
    const todoService = new TodoService(req.user!.user_id);
    const todos = await todoService.add(todoText);
    res.json({ todos });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Mark todo as complete
router.post('/todos/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const todoService = new TodoService(req.user!.user_id);
    const todos = await todoService.markCompleted(id);
    res.json({ todos });
  } catch (error) {
    console.error('Error completing todo:', error);
    res.status(500).json({ error: 'Failed to complete todo' });
  }
});

// Delete a todo
router.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todoService = new TodoService(req.user!.user_id);
    const todos = await todoService.delete(id);
    res.json({ todos });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;