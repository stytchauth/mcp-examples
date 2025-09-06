import { NextResponse } from 'next/server';
import { TodoService } from '@/services/TodoService';
import { stytchClient } from '@/lib/stytch';
import { withAuth } from '@/lib/withAuth';

const completeTodo = withAuth<{ id: string }>(async (req, session, params) => {
  const todoService = new TodoService(stytchClient, session.user_id);
  const todos = await todoService.markCompleted(params.id);
  
  return NextResponse.json({ todos });
}, 'Failed to complete todo');

export { completeTodo as POST };