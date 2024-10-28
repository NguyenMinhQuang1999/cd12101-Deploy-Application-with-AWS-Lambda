import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import AWSXRay from 'aws-xray-sdk-core'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getUserId } from '../utils.mjs'
import { setAttachmentUrl } from '../../businessLogic/todos.mjs'

const s3Client = AWSXRay.captureAWSv3Client(new S3Client())
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const uploadUrl = await getUploadUrl(todoId)
  const url = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  await setAttachmentUrl(userId, todoId, url)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}

async function getUploadUrl(id) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: id
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}
