import type { Message } from '@/types/messages'
import type { GetMessagesResponse, PostMessageResponse } from './types'

function transformMessage(message: Message): Message {
  return {
    ...message,
    timestamp: new Date(message.timestamp),
  }
}

export function transformGetMessagesResponse(response: any): GetMessagesResponse {
  return {
    ...response,
    data: response.data.map(transformMessage),
  }
}

export function transformPostMessageResponse(response: any): PostMessageResponse {
  return {
    ...response,
    message: transformMessage(response.message),
  }
}
