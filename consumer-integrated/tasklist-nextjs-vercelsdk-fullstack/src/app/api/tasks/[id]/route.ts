import { NextResponse } from 'next/server';
import { TaskListService } from '@/services/TaskService';
import { stytchClient } from '@/lib/stytch';
import { withAuth } from '@/lib/withAuth';

const deleteTask = withAuth<{ id: string }>(async (req, session, params) => {
  const taskListService = new TaskListService(stytchClient, session.user_id);
  const tasks = await taskListService.delete(params.id);
  
  return NextResponse.json({ tasks });
}, 'Failed to delete task');

export { deleteTask as DELETE };