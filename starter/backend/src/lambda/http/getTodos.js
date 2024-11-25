// TODO: Get all TODO items for the current user

import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { getUserId } from '../utils.mjs';
import { getTodosLogic } from '../../businessLogic/todos.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event); // Lấy ID người dùng từ sự kiện
    const todos = await getTodosLogic(userId); // Lấy danh sách TODO của người dùng
    const response = { items: todos }; // Tạo phản hồi với danh sách TODO
    return {
      statusCode: 200, // Trả về mã trạng thái thành công
      body: JSON.stringify(response) // Chuyển đổi phản hồi thành chuỗi JSON
    };
  });
