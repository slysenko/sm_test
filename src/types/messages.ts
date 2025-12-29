export type TextMessageContent = {
  type: 'text'
  text: string
}

export type ImageMessageContent = {
  type: 'image'
  imageUrl: string
  caption?: string
}

export type MessageContent = TextMessageContent | ImageMessageContent

export interface Message {
  id: number
  content: MessageContent
  isOutgoing: boolean
  isDelivered: boolean
  timestamp: Date
  channel: string
}
