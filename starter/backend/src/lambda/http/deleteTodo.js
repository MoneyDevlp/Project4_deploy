// TODO: Remove a TODO item by id
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { deleteTodoLogic } from '../../businessLogic/todos.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId; // Lấy ID của TODO từ tham số đường dẫn
    const userId = getUserId(event); // Lấy ID người dùng từ sự kiện

    await deleteTodoLogic(userId, todoId); // Gọi logic để xóa TODO

    return {
      statusCode: 202, // Mã trạng thái cho thành công (đã tiếp nhận yêu cầu)
      headers: {
        'Access-Control-Allow-Origin': '*' // Cho phép truy cập từ bất kỳ nguồn nào
      },
      body: JSON.stringify({}) // Trả về đối tượng JSON rỗng
    };
  });
