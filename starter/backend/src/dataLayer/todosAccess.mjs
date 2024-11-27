import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, PutCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import AWSXRay from 'aws-xray-sdk-core';

const docClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({ region: "us-east-1" }));
const todosTable = process.env.TODOS_TABLE;

export const getTodos = async (userId) => {
    const command = new QueryCommand({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    });
    const result = await docClient.send(command);
    return result.Items;
}

export const createTodo = async (newTodo) => {
    const command = new PutCommand({
        TableName: todosTable,
        Item: newTodo
    });
    await docClient.send(command);
    return newTodo;
}

export const deleteTodo = async (userId, todoId) => {
    const command = new DeleteCommand({
        TableName: todosTable,
        Key: { userId, todoId }
    });
    await docClient.send(command);
}

export const updateTodo = async (userId, todoId, todoUpdate) => {
    const command = new UpdateCommand({
        TableName: todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
            ':name': todoUpdate.name,
            ':dueDate': todoUpdate.dueDate,
            ':done': todoUpdate.done,
        }
    });
    await docClient.send(command);
}

export const saveImgUrl = async (userId, todoId, bucketName) => {
    try {
        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;
        const command = new UpdateCommand({
            TableName: todosTable,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': imageUrl,
            }
        });
        await docClient.send(command);
    } catch (error) {
        logger.error('Error saveImgUrl: ', error);
    }
}