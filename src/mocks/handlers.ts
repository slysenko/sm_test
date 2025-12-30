import { http, HttpResponse } from 'msw'
import { allMockMessages } from '../utils/mockMessages'
import type {
  GetMessagesResponse,
  PostMessageRequest,
  PostMessageResponse,
  ErrorResponse,
} from '../handlers/types'
import type { Message } from '@/types/messages'

const messageStore: Message[] = [...allMockMessages]
let nextMessageId = Math.max(...messageStore.map((m) => m.id)) + 1

const MESSAGES_URL = 'https://example.sm.chat/api/messages'

export const handlers = [
  http.get(MESSAGES_URL, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10)

    if (page < 1) {
      return HttpResponse.json<ErrorResponse>(
        {
          error: 'Invalid Request',
          message: 'Page number must be >= 1',
          statusCode: 400,
        },
        { status: 400 },
      )
    }

    if (pageSize < 1 || pageSize > 100) {
      return HttpResponse.json<ErrorResponse>(
        {
          error: 'Invalid Request',
          message: 'Page size must be between 1 and 100',
          statusCode: 400,
        },
        { status: 400 },
      )
    }

    const totalMessages = messageStore.length
    const totalPages = Math.ceil(totalMessages / pageSize)

    const startIndex = Math.max(0, totalMessages - page * pageSize)
    const endIndex = totalMessages - (page - 1) * pageSize

    const pageMessages = messageStore.slice(startIndex, endIndex).reverse()

    const response: GetMessagesResponse = {
      data: pageMessages,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalMessages: totalMessages,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(response, { status: 200 }))
      }, 300)
    })
  }),

  http.post(MESSAGES_URL, async ({ request }) => {
    try {
      const body = (await request.json()) as PostMessageRequest

      if (!body.content || !body.channel) {
        return HttpResponse.json<ErrorResponse>(
          {
            error: 'Invalid Request',
            message: 'Missing required fields: content, channel',
            statusCode: 400,
          },
          { status: 400 },
        )
      }

      if (body.content.type === 'text' && !body.content.text) {
        return HttpResponse.json<ErrorResponse>(
          {
            error: 'Invalid Request',
            message: 'Text message must have text field',
            statusCode: 400,
          },
          { status: 400 },
        )
      }

      if (body.content.type === 'image' && !body.content.imageUrl) {
        return HttpResponse.json<ErrorResponse>(
          {
            error: 'Invalid Request',
            message: 'Image message must have imageUrl field',
            statusCode: 400,
          },
          { status: 400 },
        )
      }

      const newMessage: Message = {
        id: nextMessageId++,
        content:
          body.content.type === 'text'
            ? { type: 'text', text: body.content.text! }
            : { type: 'image', imageUrl: body.content.imageUrl!, caption: body.content.caption },
        isOutgoing: true,
        isDelivered: true,
        timestamp: new Date(),
        channel: body.channel,
      }

      messageStore.push(newMessage)

      const response: PostMessageResponse = {
        success: true,
        message: newMessage,
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(HttpResponse.json(response, { status: 201 }))
        }, 200)
      })
    } catch (error) {
      return HttpResponse.json<ErrorResponse>(
        {
          error: 'Server Error',
          message: 'Failed to process request',
          statusCode: 500,
        },
        { status: 500 },
      )
    }
  }),
]
