import * as uuid from 'uuid';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../dataLayer/todosAccess.mjs';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('todos');

export const getTodosLogic = async (userId) => {
  return await getTodos(userId);
};

export const createTodoLogic = async (userId, todo) => {
  const todoId = uuid.v4();
  logger.info(`Creating todo ${todoId}`);
  const newTodo = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...todo,
  };
  return await createTodo(newTodo); 
};

export const updateTodoLogic = async (userId, todoId, todo) => {
  return await updateTodo(userId, todoId, todo);
};

export const deleteTodoLogic = async (userId, todoId) => {
  return await deleteTodo(userId, todoId);
};
