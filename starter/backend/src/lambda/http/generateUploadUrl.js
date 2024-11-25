// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';
import { saveImgUrl } from '../../dataLayer/todosAccess.mjs';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketName = process.env.S3_BUCKET; // Lấy tên bucket từ biến môi trường
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION); // Thời gian hết hạn của URL đã ký
const logger = createLogger('generateUploadUrl'); // Khởi tạo logger cho việc tạo URL upload
const client = new S3Client({ region: "us-east-1" }); // Khởi tạo client S3

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId; // Lấy ID của TODO từ tham số đường dẫn

    logger.info('Generating upload URL:', {
      todoId,
      bucketName
    });
    const userId = getUserId(event); // Lấy ID người dùng từ sự kiện

    const command = new PutObjectCommand({ Bucket: bucketName, Key: todoId }); // Tạo lệnh để đưa đối tượng lên S3
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: urlExpiration }); // Lấy URL đã ký để upload

    logger.info('Generated upload URL:', {
      todoId,
      uploadUrl
    });

    await saveImgUrl(userId, todoId, bucketName); // Lưu URL hình ảnh vào cơ sở dữ liệu

    return {
      statusCode: 200, // Mã trạng thái cho thành công
      headers: {
        'Access-Control-Allow-Origin': '*' // Cho phép truy cập từ bất kỳ nguồn nào
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl // Trả về URL đã ký
      })
    };
  });
