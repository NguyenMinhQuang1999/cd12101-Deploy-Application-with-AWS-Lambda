import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
const logger = createLogger('createTodo')

export async function handler(event) {
  const userId = getUserId(event)
  logger.info('Event', event)
  const parsedBody = JSON.parse(event.body)
  const newItem = await createTodo(userId, parsedBody)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}

