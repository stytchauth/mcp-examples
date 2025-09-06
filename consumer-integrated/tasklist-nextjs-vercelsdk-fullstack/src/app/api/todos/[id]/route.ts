import { NextResponse } from 'next/server';
import { TodoService } from '@/services/TodoService';
import { stytchClient } from '@/lib/stytch';
import { withAuth } from '@/lib/withAuth';

const deleteTodo = withAuth<{ id: string }>(async (req, session, params) => {
  const todoService = new TodoService(stytchClient, session.user_id);
  const todos = await todoService.delete(params.id);
  
  return NextResponse.json({ todos });
}, 'Failed to delete todo');

export { deleteTodo as DELETE };