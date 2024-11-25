import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { createTodoLogic } from '../../businessLogic/todos.mjs';

// TODO: Implement functionality for adding a new TODO item

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodoData = JSON.parse(event.body);
    const userId = getUserId(event); 
    const createdTodo = await createTodoLogic(userId, newTodoData);
    const response = { item: createdTodo };

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response) 
    };
  });
