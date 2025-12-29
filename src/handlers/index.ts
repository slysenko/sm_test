import type { GetMessagesResponse, PostMessageRequest, PostMessageResponse } from './types'
import { transformGetMessagesResponse, transformPostMessageResponse } from './transformers'

const MESSAGES_URL = 'https://example.sm.chat/api/messages'

export async function getMessages(
  page: number = 1,
  pageSize: number = 20,
): Promise<GetMessagesResponse> {
  const url = new URL(MESSAGES_URL)
  url.searchParams.set('page', page.toString())
  url.searchParams.set('pageSize', pageSize.toString())

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch messages')
  }

  const data = await response.json()
  return transformGetMessagesResponse(data)
}

export async function postMessage(messageData: PostMessageRequest): Promise<PostMessageResponse> {
  const response = await fetch(MESSAGES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to post message')
  }

  const data = await response.json()
  return transformPostMessageResponse(data)
}
