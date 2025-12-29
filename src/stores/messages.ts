import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMessages, postMessage as postMessageApi } from '../handlers'
import type { PostMessageRequest } from '../handlers/types'
import type { Message } from '@/types/messages'

export type MessageListItem =
  | { id: string; type: 'date'; data: Date }
  | { id: string; type: 'message'; data: Message }

const MESSAGES_PER_BATCH = 20

function normalizeDate(date: Date) {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized.getTime()
}

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref<Message[]>([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const isLoading = ref(false)

  const messagesWithDateSeparators = computed<MessageListItem[]>(() => {
    if (messages.value.length === 0) return []

    const result: MessageListItem[] = []
    let lastDate: number | null = null

    messages.value.forEach((message) => {
      const messageDate = normalizeDate(message.timestamp)

      if (lastDate !== messageDate) {
        result.push({
          id: `date-${messageDate}`,
          type: 'date',
          data: message.timestamp,
        })
        lastDate = messageDate
      }

      result.push({
        id: `message-${message.id}`,
        type: 'message',
        data: message,
      })
    })

    return result
  })

  const hasMoreMessages = computed(() => currentPage.value < totalPages.value)

  async function fetchMessages() {
    isLoading.value = true

    try {
      const response = await getMessages(1, MESSAGES_PER_BATCH)
      messages.value = response.data
      currentPage.value = response.pagination.currentPage
      totalPages.value = response.pagination.totalPages
    } catch (error) {
      console.error('Failed to load messages:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMoreMessages() {
    if (isLoading.value || currentPage.value >= totalPages.value) return

    isLoading.value = true

    try {
      const nextPage = currentPage.value + 1
      const response = await getMessages(nextPage, MESSAGES_PER_BATCH)

      messages.value = [...response.data, ...messages.value]
      currentPage.value = response.pagination.currentPage
    } catch (error) {
      console.error('Failed to load more messages:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(messageData: PostMessageRequest) {
    try {
      const response = await postMessageApi(messageData)

      if (response.success) {
        messages.value = [...messages.value, response.message]
      }

      return response
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  return {
    messages,
    currentPage,
    totalPages,
    isLoading,

    messagesWithDateSeparators,
    hasMoreMessages,

    fetchMessages,
    fetchMoreMessages,
    sendMessage,
  }
})
