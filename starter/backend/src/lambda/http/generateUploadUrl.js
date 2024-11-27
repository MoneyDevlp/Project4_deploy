import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { saveImgUrl } from '../../dataLayer/todosAccess.mjs';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const bucketName = process.env.S3_BUCKET;
const client = new S3Client({ region: "us-east-1" });

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;

    const uploadUrl = await getSignedUrl(client, new PutObjectCommand({ Bucket: bucketName, Key: todoId }), { expiresIn: Number(urlExpiration) });

    await saveImgUrl(userId, todoId, bucketName);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    };
  });