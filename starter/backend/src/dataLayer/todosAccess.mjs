import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'
const logger = createLogger('Todo')


export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getTodos(userId) {
    try {
      const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      return result.Items
    } catch (error) {
      logger.info('getTodos', error)
      throw error;
    }

  }

  async createTodo(data) {
    try {
      return await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: data
      })
    } catch (error) {
      logger.info('createTodo', error)
      throw error
    }

  }

  async deleteTodo(userId, todoId) {
    try {
      await this.dynamoDbClient.delete({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      })
    } catch (error) {
      logger.info('deleteTodo', error)
      throw error;
    }
  }

  async updateTodo(userId, todoId, { name, dueDate, done }) {
   try {
       await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId,
      },
      UpdateExpression: 'set #nameField = :nameValue, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#nameField": "name"
      },
      ExpressionAttributeValues: {
        ':nameValue': name,
        ':dueDate': dueDate,
        ':done': done
      }
    })
   } catch (error) {
    logger.info('updateTodo', error)
    throw error;
   }

  }

  async setAttachmentUrl(userId, todoId, attachmentUrl) {
    try {
        await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId,
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
    } catch (error) {
      logger.info('updateTodo', error)
      throw error
    }
  }
}