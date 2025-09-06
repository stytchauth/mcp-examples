import { NextResponse } from 'next/server';
import { TaskListService } from '@/services/TaskService';
import { stytchClient } from '@/lib/stytch';
import { withAuth } from '@/lib/withAuth';

const completeTask = withAuth<{ id: string }>(async (req, session, params) => {
  const taskListService = new TaskListService(stytchClient, session.user_id);
  const tasks = await taskListService.markCompleted(params.id);
  
  return NextResponse.json({ tasks });
}, 'Failed to complete task');

export { completeTask as POST };