import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  await deleteTodo(userId, todoId)
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
