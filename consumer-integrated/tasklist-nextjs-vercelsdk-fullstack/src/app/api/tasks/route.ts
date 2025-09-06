import { NextResponse } from 'next/server';
import { TaskListService } from '@/services/TaskService';
import { stytchClient } from '@/lib/stytch';
import { withAuth } from '@/lib/withAuth';

const getTasks = withAuth(async (req, session) => {
  const taskListService = new TaskListService(stytchClient, session.user_id);
  const tasks = await taskListService.get();
  
  return NextResponse.json({ tasks });
}, 'Failed to get tasks');

const createTask = withAuth(async (req, session) => {
  const { text } = await req.json();
  if (!text) {
    return NextResponse.json(
      { error: 'text is required' }, 
      { status: 400 }
    );
  }

  const taskListService = new TaskListService(stytchClient, session.user_id);
  const tasks = await taskListService.add(text);
  
  return NextResponse.json({ tasks });
}, 'Failed to add task');

export { getTasks as GET, createTask as POST };