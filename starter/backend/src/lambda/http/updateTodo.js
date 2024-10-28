import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await updateTodo(userId, todoId, updatedTodo)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
