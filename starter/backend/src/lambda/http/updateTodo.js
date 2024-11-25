// TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { updateTodoLogic } from '../../businessLogic/todos.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId; // Lấy ID TODO từ tham số đường dẫn
    const updatedTodo = JSON.parse(event.body); // Phân tích cú pháp đối tượng cập nhật từ thân yêu cầu
    const userId = getUserId(event); // Lấy ID người dùng từ sự kiện
    await updateTodoLogic(userId, todoId, updatedTodo); // Cập nhật TODO với thông tin mới
    return {
      statusCode: 200, // Trả về mã trạng thái thành công
      headers: {
        'Access-Control-Allow-Origin': '*' // Cho phép truy cập từ mọi nguồn
      },
      body: JSON.stringify(updatedTodo) // Trả về đối tượng cập nhật dưới dạng chuỗi JSON
    };
  });
