import type { Message } from '@/types/messages'

export interface GetMessagesRequest {
  page: number
  pageSize: number
}

export interface PostMessageRequest {
  content: {
    type: 'text' | 'image'
    text?: string
    imageUrl?: string
    caption?: string
  }
  channel: string
}

export interface GetMessagesResponse {
  data: Message[]
  pagination: {
    currentPage: number
    pageSize: number
    totalMessages: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface PostMessageResponse {
  success: boolean
  message: Message
}

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}
