import { v4 as uuidv4 } from 'uuid'
import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todosAccess = new TodoAccess()

export async function getTodos(userId) {
  return await todosAccess.getTodos(userId)
}

export async function createTodo(userId, data) {
  const todoId = uuidv4()
  const newItem = {
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...data
  }
  await todosAccess.createTodo(newItem)

  return newItem
}

export async function deleteTodo(userId, todoId) {
  await todosAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(userId, todoId, data) {
  return todosAccess.updateTodo(userId, todoId, data)
}

export async function setAttachmentUrl(userId, todoId, url) {
  return todosAccess.setAttachmentUrl(userId, todoId, url)
}
