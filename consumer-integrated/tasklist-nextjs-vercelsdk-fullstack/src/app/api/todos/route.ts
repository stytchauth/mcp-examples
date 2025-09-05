import { NextResponse } from 'next/server';
import { TodoService } from '@/services/TodoService';
import { stytchClient } from '@/lib/stytch';
import { withAuth } from '@/lib/withAuth';

const getTodos = withAuth(async (req, session) => {
  const todoService = new TodoService(stytchClient, session.user_id);
  const todos = await todoService.get();
  
  return NextResponse.json({ todos });
}, 'Failed to get todos');

const createTodo = withAuth(async (req, session) => {
  const { text } = await req.json();
  if (!text) {
    return NextResponse.json(
      { error: 'text is required' }, 
      { status: 400 }
    );
  }

  const todoService = new TodoService(stytchClient, session.user_id);
  const todos = await todoService.add(text);
  
  return NextResponse.json({ todos });
}, 'Failed to add todo');

export { getTodos as GET, createTodo as POST };