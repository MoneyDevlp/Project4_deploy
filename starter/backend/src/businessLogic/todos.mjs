import * as uuid from 'uuid';
import { createTodo } from '../dataLayer/todosAccess.mjs';

export const handleCreateTodo = async (userId, todo) => {
  const todoId = uuid.v4();
  const newTodo = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...todo,
  };
  return await createTodo(newTodo); 
};
